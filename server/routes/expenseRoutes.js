let express = require('express')
let expenseModels = require('../models/expenseModels')
let router = express.Router()
let auth = require('../middlewares/auth')


// all expenses
router.get('/dashboard', auth, async (req, res) => {
    try{
    let allexpensesGivenToFrontend = await expenseModels.aggregate([
        {
            $match : {
                "contributors": req.user.username
            }
        },
        {
            $limit : 5
        }
    ])

    res.json({allexpensesGivenToFrontend})
    }catch(err){
        console.log("error sending all expenses from backend", err)
    }
})


router.get('/', auth, async (req, res) => {
    try{
    let allexpensesGivenToFrontend = await expenseModels.find({
        contributors : req.user.username
    })

    res.json({allexpensesGivenToFrontend})
    }catch(err){
        console.log("error sending all expenses from backend", err)
    }
})


// expenses page me user ka total amount
router.get('/minimumTransactionInAllExpenses', auth, async (req, res)=>{
    try{
    let minimumtransactionOfUserInAllExpenses = await expenseModels.aggregate([
        {
            $project:{
                finalResult : {
                    $map:{
                    input: {"$objectToArray" : '$percentages'},
                    as : "oneuser",
                    in : {
                        "user":"$$oneuser.k",
                        "amount":{
                            $cond : [
                                {$eq : ["$$oneuser.k" , "$paidBy"]}
                            , 
                            {$subtract : ["$totalAmount", {$multiply : [{$divide : ["$totalAmount", 100]} , "$$oneuser.v"]}]},
                            {$multiply : [{$divide : ["$totalAmount", -100]} , "$$oneuser.v"]}
                                ]
                            }
                        }
                    }
                
                    }
                }
        },

        {$unwind : "$finalResult"},
            

        {
            $group:{
                "_id":"$finalResult.user",
                "totalAmount":{
                    $sum : "$finalResult.amount"
                }
            }
        },

        {
            $project:{
                user:"$_id",
                "totalAmount":1
            }
        }, {
            $match:{"user":req.user.username}
        }
    ])

    let amountOwedByUserTotal = await expenseModels.aggregate([
        {
            $project:{
                finalResult : {
                    $map:{
                    input: {"$objectToArray" : '$percentages'},
                    as : "oneuser",
                    in : {
                        "user":"$$oneuser.k",
                        "amount":{
                            $cond : [
                                {$eq : ["$$oneuser.k" , "$paidBy"]}
                            , 
                            {$subtract : ["$totalAmount", {$multiply : [{$divide : ["$totalAmount", 100]} , "$$oneuser.v"]}]},
                            {$multiply : [{$divide : ["$totalAmount", -100]} , "$$oneuser.v"]}
                                ]
                            }
                        }
                    }
                
                    }
                }
        },

        {$unwind : "$finalResult"},
            

        {
            $group:{
                "_id":"$finalResult.user",
                "totalAmount":{
                            $sum : {
                                $cond : [
                                    {$lt : ["$finalResult.amount", 0]},
                                    "$finalResult.amount",
                                    0
                                ]
                            }
                    }
            }
        },

        {
            $project:{
                user:"$_id",
                "totalAmount":1
            }
        }, 
        {
            $match:{"user":req.user.username}
        }
    ])

    let amountToBeRecievedByUserTotal = await expenseModels.aggregate([
        {
            $project:{
                finalResult : {
                    $map:{
                    input: {"$objectToArray" : '$percentages'},
                    as : "oneuser",
                    in : {
                        "user":"$$oneuser.k",
                        "amount":{
                            $cond : [
                                {$eq : ["$$oneuser.k" , "$paidBy"]}
                            , 
                            {$subtract : ["$totalAmount", {$multiply : [{$divide : ["$totalAmount", 100]} , "$$oneuser.v"]}]},
                            {$multiply : [{$divide : ["$totalAmount", -100]} , "$$oneuser.v"]}
                                ]
                            }
                        }
                    }
                
                    }
                }
        },

        {$unwind : "$finalResult"},
            

        {
            $group:{
                "_id":"$finalResult.user",
                "totalAmount":{
                            $sum : {
                                $cond : [
                                    {$gt : ["$finalResult.amount", 0]},
                                    "$finalResult.amount",
                                    0
                                ]
                            }
                    }
            }
        },

        {
            $project:{
                user:"$_id",
                "totalAmount":1
            }
        }, 
        {
            $match:{"user":req.user.username}
        }
    ])

    let amountToBePaidByCurrentUser = await expenseModels.aggregate([

            {
                $project : {
                    finalResult : {
                        $map:{
                            input:{"$objectToArray":"$percentages"},
                            as:"contributor",
                            in : {
                                    "user":"$$contributor.k",
                                    amount : {
                                        $cond :[
                                            {$eq : ["$$contributor.k", "$paidBy"]},
                                            {$subtract : ["$totalAmount", {$multiply : [{$divide : ["$totalAmount", 100]} , "$$contributor.v"]}]},
                                            {$multiply : [{$divide : ["$totalAmount", -100]} , "$$contributor.v"]}
                                        ]
                                    }
                            }
                        }
                    }
                }
            },

            {
                $unwind: "$finalResult"
            },
            
            {
                $match:{
                    "finalResult.user":req.user.username
                }
            }
    ])

   

    res.json({minimumtransactionOfUserInAllExpenses, amountToBePaidByCurrentUser, amountOwedByUserTotal, amountToBeRecievedByUserTotal})
}catch(err){
    console.log("errro sending minimum transaction of all expenses", err)
}
})



// group me
router.get('/:groupId', auth, async (req, res)=>{

    try{
        // all expenses in a group 
        let totalExpense = await expenseModels.aggregate([
            {
                $match:{
                    "groupId":req.params.groupId
                }
            }
        ])
 
        // users contribution in each expenses of a group
        let amountToBePaidByUser = await expenseModels.aggregate([
            {
                $match:{
                    "groupId" : req.params.groupId
                }
            },

            {
                $project : {
                    finalResult : {
                        $map:{
                            input:{"$objectToArray":"$percentages"},
                            as:"contributor",
                            in : {
                                    "user":"$$contributor.k",
                                    amount : {
                                        $cond :[
                                            {$eq : ["$$contributor.k", "$paidBy"]},
                                            {$subtract : ["$totalAmount", {$multiply : [{$divide : ["$totalAmount", 100]} , "$$contributor.v"]}]},
                                            {$multiply : [{$divide : ["$totalAmount", -100]} , "$$contributor.v"]}
                                        ]
                                    }
                            }
                        }
                    }
                }
            }
        ])

        // net +- contribution of user (5th column)
        let amountToBePaidByCurrentUser = await expenseModels.aggregate([
            {
                $match:{
                    "groupId" : req.params.groupId
                }
            },

            {
                $project : {
                    finalResult : {
                        $map:{
                            input:{"$objectToArray":"$percentages"},
                            as:"contributor",
                            in : {
                                    "user":"$$contributor.k",
                                    amount : {
                                        $cond :[
                                            {$eq : ["$$contributor.k", "$paidBy"]},
                                            {$subtract : ["$totalAmount", {$multiply : [{$divide : ["$totalAmount", 100]} , "$$contributor.v"]}]},
                                            {$multiply : [{$divide : ["$totalAmount", -100]} , "$$contributor.v"]}
                                        ]
                                    }
                            }
                        }
                    }
                }
            },

            {
                $unwind: "$finalResult"
            },
            
            {
                $match:{
                    "finalResult.user":req.user.username
                }
            }
        ])

        res.json({
            "totalExpense" : totalExpense,
            "amountToBePaidByUser":amountToBePaidByUser,
            "amountToBePaidByCurrentUser":amountToBePaidByCurrentUser
        })

    }catch(err){
        console.log("error getting all expenses in backend", err)
    }
})


router.get('/:groupId/minimumTransaction', auth, async (req,res)=>{
    try{

        // minimum transaction of all users in a group
        let minimumTransactionsInBackend = await expenseModels.aggregate([
            {
                $match:{
                    "groupId" : req.params.groupId
                }
            },

            {
                $project : {
                    finalResult : {
                        $map:{
                            input:{"$objectToArray":"$percentages"},
                            as:"contributor",
                            in : {
                                    "user":"$$contributor.k",
                                    amount : {
                                        $cond :[
                                            {$eq : ["$$contributor.k", "$paidBy"]},
                                            {$subtract : ["$totalAmount", {$multiply : [{$divide : ["$totalAmount", 100]} , "$$contributor.v"]}]},
                                            {$multiply : [{$divide : ["$totalAmount", -100]} , "$$contributor.v"]}
                                        ]
                                    }
                            }
                        }
                    }
                }
            },

            {$unwind : "$finalResult"},
            

            {
                $group:{
                    "_id":"$finalResult.user",
                    "totalAmount":{
                        $sum : "$finalResult.amount"
                    }
                }
            },

            {
                $project:{
                    user:"$_id",
                    "totalAmount":1
                }
            }
        ])

        // minimum transaction only of current user in a group
        let minimumTransactionsInBackendForCurrentuser = await expenseModels.aggregate([
            {
                $match:{
                    "groupId" : req.params.groupId
                }
            },

            {
                $project : {
                    finalResult : {
                        $map:{
                            input:{"$objectToArray":"$percentages"},
                            as:"contributor",
                            in : {
                                    "user":"$$contributor.k",
                                    amount : {
                                        $cond :[
                                            {$eq : ["$$contributor.k", "$paidBy"]},
                                            {$subtract : ["$totalAmount", {$multiply : [{$divide : ["$totalAmount", 100]} , "$$contributor.v"]}]},
                                            {$multiply : [{$divide : ["$totalAmount", -100]} , "$$contributor.v"]}
                                        ]
                                    }
                            }
                        }
                    }
                }
            },

            {$unwind : "$finalResult"},
            

            {
                $group:{
                    "_id":"$finalResult.user",
                    "totalAmount":{
                        $sum : "$finalResult.amount"
                    }
                }
            },

            {
                $project:{
                    user:"$_id",
                    "totalAmount":1
                }
            },

            {
                $match : {
                    "user":req.user.username
                }
            }
        ])

    res.json({
        minimumTransactionsInBackend, minimumTransactionsInBackendForCurrentuser
    })

    }catch(err){
        console.log("error getting minmum transactions")
    }

})


router.post('/:groupId/add', auth, async (req, res)=>{
    console.log(req.body)

    if(req.body.splitType == "" || !req.body.paidBy || !req.body.totalAmount || !req.body.expenseName || !req.body.expenseDescription) return res.status(400).json({"message":"Fill All The Provided Inputs!"})

    let expenseDataInBackend = await expenseModels.create(req.body)

    if(req.body.splitType == "Equal"){
        console.log("equal")
    } 
})


module.exports = router
