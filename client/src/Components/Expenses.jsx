import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Expenses() {
    let [expenses, setExpenses] = useState([])

    // in one expense
    let [totalExpenseOfAUserInOneExpense, setTotalExpenseOfAUserInOneExpense] = useState([])

    // all expenses
    let [minimumtransactionOfUserInAllExpenses, setminimumtransactionOfUserInAllExpenses] = useState([])
    let token = localStorage.getItem('token')

    let getAllExpenses = async () =>{
        try{
            let allexpensesfrombackend = await axios.get('http://localhost:3000/expenses/', {
            headers:{
                Authorization:`Bearer ${token}`
            }
        })

        setExpenses(allexpensesfrombackend.data.allexpensesGivenToFrontend)
        }catch(err){
            console.log("error getting all expenses", err)
        }
    }

    let minimumTransactionOfUserInAllExpneses = async () => {
        try{
            let minimumtransactionofallexpensesofuser = await axios.get('http://localhost:3000/expenses/minimumTransactionInAllExpenses', {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })

            setTotalExpenseOfAUserInOneExpense(minimumtransactionofallexpensesofuser.data.amountToBePaidByCurrentUser)
            setminimumtransactionOfUserInAllExpenses(minimumtransactionofallexpensesofuser.data.minimumtransactionOfUserInAllExpenses)
            console.log(minimumtransactionofallexpensesofuser.data.minimumtransactionOfUserInAllExpenses[0].totalAmount)

        }catch(err){
            console.log("error getting minimum transaction of user in all expenses",err)
        }
    }

    useEffect(()=>{
        getAllExpenses()
        minimumTransactionOfUserInAllExpneses()
    }, [])

  return (
    <div className='flex justify-center items-center flex-col ml-60'>

           

        <div className='flex justify-between items-center mr-6 ml-6 my-6 w-[95%] mb-6'>
            <p className='text-4xl font-bold text-[#1d4ed8]'>Your Expenses!</p>
            <button className='opacity-0 bg-[#1d4ed8] px-2 py-0.5 hover:bg-blue-700/60 text-white'>Add Group</button>
          </div>

           <div className='flex justify-between items-center mr-6 ml-6 w-[95%] mb-10'>
                <p>Net Balance : <span className={`${minimumtransactionOfUserInAllExpenses[0]?.totalAmount ? "text-green-600" : "text-red-600"}`}>{minimumtransactionOfUserInAllExpenses[0]?.totalAmount}</span></p>
                <button className='opacity-0 bg-[#1d4ed8] px-2 py-0.5 hover:bg-blue-700/60 text-white'>Add Group</button>

            </div>

        <div className='border-2 border-[#1d4ed8]/20 rounded-xl pt-4'>

        <div className='flex justify-evenly items-center border-b border-b-gray-300 pb-3 w-[70vw] text-gray-500 text-lg'>
          <p className='w-[14vw] flex justify-center items-center'>Index</p>
          <p className='w-[14vw] flex justify-center items-center'>Title</p>
          <p className='w-[14vw] flex justify-center items-center'>Paid By</p>
          <p className='w-[14vw] flex justify-center items-center'>Total Amount</p>
          <p className='w-[14vw] flex justify-center items-center'>Your Contribution</p>
        <button className='w-[14vw] flex justify-center items-center opacity-0'>View</button>
            </div>

            <div className=''>
        {
          expenses.map((expense, index)=>{
                    
                    return <div className='flex justify-evenly items-center w-[70vw] border-b border-b-gray-300 py-7' key={index}>
                      <p className='w-[14vw] flex justify-center items-center'>{index+1}</p>
                      <p className='w-[14vw] flex justify-center items-center'>{expense.expenseName}</p>
                      <p className='w-[14vw] flex justify-center items-center'>{expense.paidBy}</p>
                      <p className='w-[14vw] flex justify-center items-center'>{expense.totalAmount}</p>
                      <p className={`w-[14vw] flex justify-center items-center text-2xl ${!totalExpenseOfAUserInOneExpense?.[index]?.finalResult.amount.toFixed(2).includes("-") ? "text-green-600" : "text-red-600"}`}>{totalExpenseOfAUserInOneExpense?.[index]?.finalResult.amount.toFixed(2) ? "" : "-"} {totalExpenseOfAUserInOneExpense?.[index]?.finalResult.amount}</p>
                        <button className='w-[14vw] flex justify-center items-center cursor-pointer'>View</button>
                    </div>
                })
        }
            </div>

        </div>
    </div>
  )
}

export default Expenses