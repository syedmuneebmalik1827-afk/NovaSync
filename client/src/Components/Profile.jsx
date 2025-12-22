import { Pencil } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function Profile() {
  let [usernameDisplay, setUsername] = useState("")
  let [emailDisplay, setEmail] = useState("")

  let token = localStorage.getItem('token')

  useEffect(()=>{
    async function getUserInfo(){

      try{
        let userInfo = await fetch('http://localhost:3000/users/me', {
          method:"GET",
          headers : {
            "Authorization":`Bearer ${token}`
          }
        })

        let data = await userInfo.json()
       
        setUsername(data.username)
        setEmail(data.email)
      }catch(err){
        console.log("error in retrieving user info", err)
      }
    }

    getUserInfo()
  },[])



  return (
    <div>
      <div className='ml-60 flex flex-col justify-center items-center h-screen profile'>
      
        <div className='bg-white shadow-xl px-10 py-10 rounded'>
          <p className='text-2xl font-bold mb-10 border-b border-b-[#1e2230] w-[30vw] text-center py-2 text-[#1d4ed8]'>Profile</p>
        
          <div className='flex justify-center items-center gap-2'>

            <div className='flex flex-col justify-start items-start'>
              <p className='text-5xl font-bold my-1 '>{usernameDisplay}</p>
              <p className='text-[#1d4ed8]/80'>{emailDisplay}</p>
              <button className='text-white rounded px-4 py-2 cursor-pointer bg-[#1d4ed8] my-5 text-sm flex justify-center items-center gap-2 '>Edit Profile <Pencil size={15}/></button>
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="[currentColor]" class="size-50 text-[#1e2230]">
  <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd"/>
</svg>           
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile