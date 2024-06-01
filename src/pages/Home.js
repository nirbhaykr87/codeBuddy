import React, { useState } from 'react'
import {v4 as uuidv4} from 'uuid';
import toast, { Toaster } from 'react-hot-toast';
import{useNavigate} from 'react-router-dom';

export default function Home() {
    const navigate=useNavigate();
    const [roomId,setRoomId]=useState();
    const [username,setusername]=useState();
    
  

const createNewRoom=(e)=>{
    e.preventDefault();
    const id=uuidv4();
    setRoomId(id)
    toast.success('Created new room')



}
const joinRoom=()=>{
    if(!roomId || !username){
        toast.error('RoomId and username required');
        return;
    }
    navigate(`editor/${roomId}`,{
        state:{
            username,
        
        }
    })
}



const handleInput=(e)=>{
    if(e.key==='Enter'){
        joinRoom();
    }

}



  return (
    <>
    
    <div className="container mainBox">


        <div className='container inputBox  pb-3'>
<img  className='' src="/codeBuddy.png" alt="codeBuddy-logo" height="110px"  width="auto" style={ {filter: 'saturate(200%)'}}/>

<h6 className=' fw-bold'>Paste invitation Room Id</h6>


    <input className='mt-1' type="text" placeholder='Room Id' onChange={(e)=>{setRoomId(e.target.value)}} value={roomId}   onKeyUp={handleInput}  />  <br />

    <input className='mt-2' type="text" placeholder='username'  onChange={(e)=>{setusername(e.target.value)}} value={username}  onKeyUp={handleInput} /> <br />
<button className='mt-2  fw-bold  btn ' onClick={joinRoom}>Join</button> <br /> <br />


<p className='text-center mt-3'>If you don't have an invite then create  &nbsp;
    <a onClick={createNewRoom} className='fw-bold' href="">New room</a>
</p>
        </div>
       
</div>
    
    </>
  )
}