import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, MoveLeft, Pencil, Users , X} from 'lucide-react'
import { AnimatePresence, motion } from "framer-motion"
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";
import ExpenseComponent from './expenseComponent'

function ViewGroup() {

    let navigate = useNavigate()
    let {groupId} = useParams()
    let token = localStorage.getItem('token')
    let [viewGroupInfo, setViewGroupInfo] = useState([])
    let [createdBy, setCreatedBy] = useState([])
    let [members, setMembers] = useState([])
    let [editPopup, setEditPopup] = useState(false)

    let [updatedGroupName, setUpdatedGroupName] = useState("")
    let [updatedGroupDescription, setUpdatedGroupDescription] = useState("")
    let [deleteGroupPopup, setDeleteGroupPopup] = useState(false)


    let [expenses, setExpenses] = useState([])

    // 
    let [totalExpense, setTotalExpense] = useState([])

    // for your contribution column
    let [amountToBePaidByCurrentUserInAnExpense, setAmountToBePaidByCurrentUserInAnExpense] = useState([])

    // at end
    let [minimumamountToBePaidByCurrentUserInAnExpense, setMinimumAmountToBePaidByCurrentUserInAnExpense] = useState([])

    let fetchExpenses = async () =>{

        try{
            let allExpenses = await axios.get(`http://localhost:3000/expenses/${groupId}`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })

            setExpenses(allExpenses.data.amountToBePaidByUser)
            // console.log(allExpenses.data.amountToBePaidByUser)

            setTotalExpense(allExpenses.data.totalExpense)
            setAmountToBePaidByCurrentUserInAnExpense(allExpenses.data.amountToBePaidByCurrentUser)
            console.log(allExpenses.data.amountToBePaidByCurrentUser[1].finalResult.amount)
        }catch(err){
            console.log("error getting expenses in view group", err)
        }
    }


    let minimumTransaction = async () =>{
        
        try{
            let minimumTransaction = await axios.get(`http://localhost:3000/expenses/${groupId}/minimumTransaction`, 
            {
            headers:{
                Authorization:`Bearer ${token}`
            }
        })

        setMinimumAmountToBePaidByCurrentUserInAnExpense(minimumTransaction.data.minimumTransactionsInBackendForCurrentuser[0].totalAmount)
        console.log(minimumTransaction.data.minimumTransactionsInBackend)

        }catch(err){
            console.log("error occured while finding minimum transactions frontend", err)
        }
    }

    useEffect(()=>{
        fetchExpenses()
        minimumTransaction()
    }, [])

    let fetchGroupInfo = async () =>{
        try{
            let fetchedData = await axios.get(`http://localhost:3000/groups/${groupId}`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })

            setViewGroupInfo(fetchedData.data[0])

            setCreatedBy(fetchedData.data[0].createdBy.username)
            setMembers(fetchedData.data[0].members)
            // console.log(fetchedData.data[0])
        }
            catch(err){
                console.log("error getting group info", err)
            }
    }


    let deleteGroupFunc = async () =>{
        try{
            let deletedGroupFrontendRequest = await axios.delete(`http://localhost:3000/groups/delete/${groupId}`,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            // console.log("deleted successfully")
            toast("Group Deleted Successfully",
            {
                style: {
                background: '#1d4ed8',
                color: '#fff',
            }})
            navigate('/groups')
        }catch(err){
            console.log("error deleting group", err)
        }
    }


    let totalExpenseData = async () => {
        let totalExpense = axios.get('http://localhost:3000/expenses/', {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
    }


    // created by ka naam

    // let createdByName = async () =>{
    //     try{
    //         let createdByInfo = await axios.get((`http://localhost:3000/users/${viewGroupInfo.createdBy}`), {
    //             headers:{
    //                 Authorization: `Bearer ${token}`
    //             }
    //         })
    //         setCreatedBy(createdByInfo.data[0])
    //         console.log(createdByInfo.data[0])
    //     }catch(err){
    //         console.log("frontend me error for createdByName", err)
    //     }
    // }

    useEffect(()=>{
        fetchGroupInfo();
        // console.log(members)
    }, [editPopup])

    // useEffect(()=>{
    //     if(viewGroupInfo.createdBy){
    //         createdByName()
    //     }
    // }, [viewGroupInfo])
        
    let updateGroup = async (e) =>{
        e.preventDefault()

        try{
            let updatedGroupKaBackendRequest = await axios.post(`http://localhost:3000/groups/update/${viewGroupInfo._id}`, {
                "updatedGroupName":updatedGroupName,
                "updatedGroupDescription":updatedGroupDescription
            }, {
                headers:{
                    Authorization:`Bearer ${token}`
                }  
            })

            toast("Saved Changes!",
            {
                style: {
                background: '#1d4ed8',
                color: '#fff',
            }})
            
        console.log("1")
        console.log("done updating")

        }catch(err){
            // console.log("error updating group data", err)
            toast(err.response.data.message,
            {
                style: {
                background: '#1d4ed8',
                color: '#fff',
            }})
        }finally{
            setEditPopup(false)
        }
    }

  return (
    <div>

        <AnimatePresence>{editPopup && 
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}>

        <div className='h-screen w-screen bg-black/50 backdrop-blur-sm fixed inset-0 flex justify-center items-center z-100'>

          <div className='bg-[#eef3ff] h-130 w-120 rounded-xl border-[#1d4ed8]/20 border-2'>

            {/* top headings  and close button*/}
            <div className='flex justify-between items-center mt-5 mb-6'>

              <div className='flex flex-col justify-center items-start ml-6'>
                <p className='text-[#1e4ed8] text-3xl font-bold text-center'>Edit Group Details</p>
                {/* <p className='text-gray-600 text-center'>Enter the following information</p> */}
              </div>

              <div>
                 <button className='flex justify-center items-center cursor-pointer text-white text-lg bg-blue-700 px-3 mr-6 py-[3.6px] rounded hover:bg-blue-700/40' onClick={(e)=>{
                  setEditPopup(false);
                 }}>Close <X/></button>
              </div>

            </div>

            {/* bottom part */}
            <div className='flex flex-row justify-center items-center  ml-5 mr-5 gap-20'>
              {/* bottom left */}
              <div className='flex flex-col justify-center items-start gap-5'>
                <div className='flex flex-col justify-center items-start'>
                  <label htmlFor="">Group Name : </label>
                  <input type="text" className='w-80 px-2 py-1 bg-white border border-[#1e2230]/20 rounded-lg text-[#1e2230] placeholder:text-[#1e2230]/40 focus:outline-none  focus:border-[#1d4ed8]
                  transition' value={updatedGroupName} onChange={(e)=> setUpdatedGroupName(e.target.value)}/>
                </div>
                <div className='flex flex-col justify-center items-start'>
                  <label htmlFor="">Group Description : </label>
                  <textarea className='w-80 h-62 px-2 py-1 bg-white border border-[#1e2230]/20 rounded-lg text-[#1e2230] placeholder:text-[#1e2230]/40 focus:outline-none  focus:border-[#1d4ed8]
                  transition' value={updatedGroupDescription} onChange={(e)=> setUpdatedGroupDescription(e.target.value)}/>
                </div>
              </div>

            </div>

            <div className='flex justify-between items-center'>
              <p className='opacity-0'>xyz</p>
              <button className='flex justify-center items-center cursor-pointer text-white mt-4 bg-blue-700 px-3 py-[3.6px] rounded hover:bg-blue-700/40 mr-6' onClick={(e)=> updateGroup(e)}>Update</button>
            </div>

          </div>

        </div></motion.div>}
        </AnimatePresence>

        <AnimatePresence>
            {deleteGroupPopup && 
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}>
            <div className='h-screen w-screen bg-black/50 backdrop-blur-sm fixed inset-0 flex justify-center items-center z-100'>

                <div className='bg-[#eef3ff] h-55 w-100 rounded-xl border-[#1d4ed8]/20 border-2'>
                    <div className='flex flex-col items-center w-full py-5'>
                                    {/* <p className='text-white text-[20px] my-1'>{title}</p> */}
                                    <p className='text-[#1e4ed8] text-2xl px-4 font-bold text-center'>Delete Group?</p>
                                    <p className='text-gray-600 text-[14px] mt-1'>Are You Sure About Deleting This Group?</p>
                                    {/* <p className='text-gray-600 text-center'>Enter the following information</p> */}
                                </div>
                    
                        <div className='flex flex-col justify-center items-center gap-5 mt-2'>
                            <button className='bg-blue-700 text-white rounded px-4 py-1 cursor-pointer w-[60%] hover:opacity-80' onClick={(e)=>{
                                e.preventDefault()
                                deleteGroupFunc()
                            }}>Delete</button>
                            <button className='bg-transparent border border-gray-600 w-[60%] text-gray-600 rounded px-py-1 cursor-pointer hover:border-black hover:text-black' onClick={(e)=>{setDeleteGroupPopup(false)}}>Cancel</button>
                        </div>
                </div>
            </div> 
        </motion.div>}
        </AnimatePresence>

        {/* poora content */}
        <div className='sm:ml-60 '>

            {/* group info */}
            <div className='flex justify-between items-center mr-6 ml-6 mt-6 gap-4'>
                {/* group Info left part*/}
                <div className='flex flex-col justify-center items-start'>
                    <Link className='flex justify-center items-center gap-1 cursor-pointer mb-5' to={'/groups'}><ArrowLeft size={15}/>Back</Link>
                    <p className='text-4xl font-bold text-[#1d4ed8] mb-4'>{viewGroupInfo.groupName}</p>
                    {/* <p className='text-4xl font-bold text-[#1d4ed8]'>{viewGroupInfo.groupDescription}</p> */}
                    <p className='text-gray-600 my-1 text-md w-[80%]'>{viewGroupInfo.groupDescription}</p>
                    

                    <div className='flex justify-center items-center my-2 gap-2'>
                        <p className='text-[#1d4ed8] font-medium text-[19px]'>Created By : </p>
                        <p className='text-gray-600'>{" "}{createdBy}</p>
                    </div>

                    <div className='flex gap-2 justify-center items-center'>
                        <p className='text-[#1d4ed8] font-medium text-[19px]'>Members :</p>
                        <div className='flex justify-center items-center gap-2'>
                            {members.map((member, index)=>{
                            return <p key={member._id} className='text-gray-600'>{member.username}</p>
                        })}
                        </div>
                    </div>

                    <div className='flex justify-center items-center gap-3 my-4'>
                        <button className='bg-[#1d4ed8] text-white py-[2px] px-[8px] hover:bg-blue-700/40 flex justify-center items-center gap-1 text-md cursor-pointer' onClick={(e)=>{
                            setEditPopup(true)
                        }}>Edit Group <Pencil size={15}/></button>
                        <button className='bg-red-600 text-white py-[2px] px-[8px] text-md cursor-pointer' onClick={(e)=>{
                            e.preventDefault()
                            setDeleteGroupPopup(true)
                        }}>Delete Group</button>
                    </div>
                </div>

                {/* group Info ka right part*/}
                <div className='flex flex-col w-[30vw]'>
                    {/* created by */}
                    
                </div>
            </div>


            {/* bottom part */}
            <div className='flex flex-col justify-center items-center w-full'>
                <div className='flex justify-between items-center w-[70vw] mt-5 mb-5'>
                    <p className='text-3xl font-bold text-[#1d4ed8]'>Expenses</p>
                    <Link to={`/groups/${groupId}/addExpense`} className='bg-[#1d4ed8] text-white py-[2px] px-[8px] flex justify-center items-center gap-1 text-md cursor-pointer hover:bg-blue-700/40'>Add Expense</Link>
                </div>

                <div className='w-[70vw] flex justify-between items-center mb-3'>
                    <p>Net Balance : <span className={`${minimumamountToBePaidByCurrentUserInAnExpense ? "text-green-600" : "text-red-600"}`}>{minimumamountToBePaidByCurrentUserInAnExpense}</span></p>
                    <button className='opacity-0 bg-[#1d4ed8] px-2 py-0.5 hover:bg-blue-700/60 text-white'>Add Group</button>
                </div>
            </div>

            <div className='my-5 flex justify-center items-center'>
                <ExpenseComponent expenses={expenses} totalExpense={totalExpense}  amountToBePaidByCurrentUserInAnExpense={amountToBePaidByCurrentUserInAnExpense}/>
            </div>


           

        </div>


    </div>

    // </div>
  )
}

export default ViewGroup