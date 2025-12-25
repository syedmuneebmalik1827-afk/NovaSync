import React from 'react'
import { useState } from 'react';

function ExpenseComponent({expenses, totalExpense, amountToBePaidByCurrentUserInAnExpense, setExpensePopup, setCurrentExpense}) {
  // console.log(amountToBePaidByCurrentUserInAnExpense?.[0]?.finalResult?.amount)
  
  return (
    <div className='flex justify-center items-center flex-col border-2 border-[#1d4ed8]/20 rounded-xl pt-4 w-[70vw]'>

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
          totalExpense.map((expense, index)=>{
                    return <div className='flex justify-evenly items-center w-[70vw] border-b border-b-gray-300 py-7' key={index}>
                      <p className='w-[14vw] flex justify-center items-center'>{index+1}</p>
                      <p className='w-[14vw] flex justify-center items-center'>{expense.expenseName}</p>
                      <p className='w-[14vw] flex justify-center items-center'>{expense.paidBy}</p>
                      <p className='w-[14vw] flex justify-center items-center'>{expense.totalAmount}</p>
                      <p className={`w-[14vw] flex justify-center items-center text-2xl ${!amountToBePaidByCurrentUserInAnExpense?.[index]?.finalResult?.amount.toFixed(2).includes("-") ? "text-green-600" : "text-red-600"}`}>{amountToBePaidByCurrentUserInAnExpense?.[index]?.finalResult?.amount.toFixed(2) ? "" : "-" }{amountToBePaidByCurrentUserInAnExpense?.[index]?.finalResult?.amount.toFixed(2)}</p>
                      <button className='w-[14vw] flex justify-center items-center cursor-pointer' onClick={(e)=>{
                            setCurrentExpense(expense)
                            setExpensePopup(true)
                            document.body.style.overflow = "hidden"
                            document.documentElement.style.overflow = "hidden"
                        }}>View</button>

                    </div>
                })
        }
      </div>
    </div>
  )
}

export default ExpenseComponent