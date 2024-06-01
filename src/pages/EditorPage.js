import React, { useEffect, useState,useRef} from 'react';
import Client from '../components/Client';
import Codemirror from'codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/python/python'
import 'codemirror/theme/dracula.css'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/lib/codemirror.css'
import { initSocket } from '../socket';
import {Navigate, useLocation,useNavigate, useParams} from 'react-router-dom'
import ACTIONS from '../Actions';
import toast from 'react-hot-toast';

export default function EditorPage() {

 

 
 const socketRef=useRef(null);
 const codeRef=useRef(null);
 const location=useLocation();
 const {roomId}=useParams();
 const reactNavigator=useNavigate();
 const [mode,setMode]=useState('java')
 const [clients,setClients]=useState([
  // {socketId: 1, username:'Nirbhay kumar'},
]);
const [showChat, setShowChat] = useState(false);
const [message, setMessage] = useState('');
const [chatMessages, setChatMessages] = useState([]);




 

async function coderun() {
  const code = {
    code: editorRef.current.getValue(),
    input: document.getElementById('input').value,  // Fix: Define 'input'
    lang: document.getElementById('inlineFormSelectPref').value,  // Fix: Define 'option'
  };

  var oData = await fetch('http://localhost:5000/compile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(code),
  });

  const d = await oData.json();
  document.getElementById('output').value = d.output;  // Fix: Define 'output'
}





const toggleChat = () => {
  setShowChat(!showChat);
};






useEffect(() => {
  const init = async () => {
      try {
          socketRef.current = await initSocket();

          socketRef.current.on('connect_error', handleErrors);
          socketRef.current.on('connect_failed', handleErrors);

          socketRef.current.emit(ACTIONS.JOIN, {
              roomId,
              username: location.state?.username,
          });

          socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
              if (username !== location.state?.username) {
                  toast.success(`${username} joined the room.`);
                  console.log(`${username} joined`);
              }
              setClients(clients);


              socketRef.current.emit(ACTIONS.SYNC_CODE,{
                code:codeRef.current,
                socketId,
              });





          });

          socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
              toast.success(`${username} left the room.`);
              setClients((prev) => prev.filter((client) => client.socketId !== socketId));
              
          });









      
          socketRef.current.on('user_message', ( {message, username} ) => {
            setChatMessages((chatMessages)=>[...chatMessages,message])
  
  
            
         
            console.log("usermessage,", message);
            let chat_box=document.getElementById("chat_messages")
            // console.log(chat_box)
          //   chat_box.innerHTML+=`<div style="background-color:yellow;justify-self:right">
          //   ${message}
          // </div>`


//             chat_box.innerHTML+= `         <p style="
//               background-color:#dcdcdc;border-Radius:5px;padding:5px;width:65%"
//             }> <span style="color: #5F6062 ">  
            
            
            
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
//   <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
//   <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
// </svg>
            
            
//             ${username}: </span>  ${message}</p>`

if(chat_box){

            chat_box.innerHTML+= `         <p style="
              background-color:#dcdcdc;border-Radius:5px;padding:5px;width:65%"
            }> <span style="color: #5F6062 ">  
            
            
            
          <img src="/man1.png"  alt="user-icon-image" height="18px">
            
            
            ${username}: </span>  ${message}</p>`



    

            
            console.log(chatMessages)
          }
          });



          
  











      } catch (error) {
          handleErrors(error);
      }
  };

  const handleErrors = (error) => {
      console.error('Socket error', error);
      toast.error('Socket connection failed, try again later.');
      reactNavigator('/');
  };

  init();

  return () => {
      if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current.off('connect_error');
          socketRef.current.off('connect_failed');
          socketRef.current.off(ACTIONS.JOINED);
          socketRef.current.off(ACTIONS.DISCONNECTED);
      }
  };
}, []);











 

  const editorRef = useRef(null);
  useEffect(()=>{
    async function init(){
      if (!editorRef.current) {
        editorRef.current = Codemirror.fromTextArea(document.getElementById('realTimeEditor'), {
          mode: { name: mode, json: 'true' },
          theme: 'dracula',
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        });


      }
      editorRef.current.on('change',(instance,changes)=>{
        console.log('changes',changes);
        const {origin}=changes;
        const code=instance.getValue();
        codeRef.current=code; 
        if(origin !='setValue'){
          socketRef.current.emit(ACTIONS.CODE_CHANGE,{
            roomId,
            code,
          });
        }
        console.log(code);

      })
   


    }

    init();
    console.log("Mode:", mode);
  }, [mode]);


useEffect(()=>{
  if(socketRef.current){
    socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
      if(code!==null){
        editorRef.current.setValue(code)
      }

    })
  }
  return ()=>{
    // socketRef.current.off(ACTIONS.CODE_CHANGE);
  }

},[socketRef.current])




if(!location.state){
  return <Navigate to='/'/> 
}

async function copyRoomId(){

  try{
    await navigator.clipboard.writeText(roomId);
    toast.success('RoomId has been copied to your clipboard')

  }catch(err){
    toast.error('Could not copy the RoomId')

  }
}

function leaveRoom(){
  reactNavigator('/');

}













const sendMessage = () => {
  if (message.trim() !== '') {
    socketRef.current.emit('user_send_message', {
      roomId,
      username: location.state?.username,
      message,
    });
    setMessage('');
  }



  let chat_box=document.getElementById("chat_messages")
  // console.log(chat_box)
//   chat_box.innerHTML+=`<div style="background-color:red;justify-self:left;">
//   <span style="float:right">${message}</span>
// </div>`


  chat_box.innerHTML+=`<p style="
    background-color:#581B98;border-Radius:5px;padding:5px;width:65%;color:white;margin-left:90px"
  }> 

          <img src="/man2.png"  alt="user-icon-image" height="18px"> You : 
  
  ${message}</p>`






 

};









  return (
    <> 

    <div className="container-fluid">
      <div className="row">
    <div className="aside col-md-2">

  <div className="asidelogo">
    <img className='img-fluid ' src="/codeBuddy.png" alt="logo" height="" style={{marginTop:'-30px' , borderBottom:'2px solid #424242'}} />
  </div>

  <h6 className='mt-1'>Connected</h6>

  <div className="clientsList d-flex flex-wrap  align-items-center text-center" style={{height:'63vh'}}>
 
{
  clients.map((client)=>(
    <Client username={client.username} key={client.socketId}/>
  ))
}


  </div>
  

  <div className='d-flex flex-column    ' >
    <button className='btn mb-2 fw-bold'  style={{backgroundColor:'white',color:'black'}} onClick={copyRoomId}>Copy RoomId</button>
    <button className='btn  fw-bold' style={{backgroundColor:'#4aee88',color:'black'}} onClick={leaveRoom}>Leave</button>
  </div>


    </div>































    <div className="mainCodeAreaWrapper col-md-10 row"> 
    
    
    <div className='col-md-9 '> 
    <div className='d-flex justify-content-between mt-2  screen_adjust p-2 rounded' style={{backgroundColor:'#282a36',}} >
    <div class="col-12 w-25" >
    <label class="visually-hidden" for="inlineFormSelectPref"></label>
    <select
  onChange={(e) => {
    const selectedMode = e.target.value;
    setMode(selectedMode);
    
    // Conditionally update the editor mode based on the selectedMode
    if (selectedMode === 'C++') {
      editorRef.current.setOption("mode", 'text/x-c++src');
    } else if (selectedMode === 'javascript') {
      editorRef.current.setOption("mode", 'javascript');
    } else if (selectedMode === 'python') {
      editorRef.current.setOption("mode", 'python');
    }
  }}
  value={mode}
  class="form-select fw-bold"
  id="inlineFormSelectPref"
  style={{ backgroundColor: '#808DAD', border: 'none', color: 'black' }}
>
  <option value="C++">C++</option>
  <option value="java">Java</option>
  <option value="python">Python</option>
</select>

    </div>
    <div>
    <button className='btn btn-success fw-bold disabled '>codeBuddy</button>
    <button className='btn btn-success ms-2 fw-bold' id="run" onClick={coderun}>   
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
</svg>
    Run</button>   </div>
  </div>
 
    

    <div className='code-writing-area mt-2'  >

    <textarea id="realTimeEditor"  type='text' rows="" ></textarea>
    


</div>
    
  







    
    
    </div>





    <div className='col-md-3 pt-4 '  style={{borderLeft:'2px solid #424242'}}>

<div >
<h5 className='text-center' style={{backgroundColor:'#282a36',padding:'6px',borderRadius:'10px'}}>Input</h5>
  <textarea name="" id="input" cols="26" rows="9" style={{backgroundColor:'#282a36',border:'none',color:'white' , padding:'4px',borderRadius:'10px'}}></textarea>


</div>
<div className='mt-3'>
  <h5 className='text-center' style={{backgroundColor:'#282a36',padding:'6px',borderRadius:'10px'}}>Output</h5>
  <textarea name="" id="output" cols="26" rows="9" style={{backgroundColor:'#282a36',border:'none',color:'white' , padding:'4px',borderRadius:'10px', marginRight:'3%'}}></textarea>
 
</div>
</div>
 </div>
</div>
  </div>


  <div className="chat-icon" onClick={toggleChat}>
        <img src="/chatbox-icon.svg" alt="Chat" style={{ width: '50px', height: '50px', position: 'fixed', bottom: '20px', right: '20px', cursor: 'pointer', backgroundColor: 'whitesmoke', borderRadius: '40%', padding: '4px' }} />
      </div>






       {/* Chat Dialog */}
       {showChat && (
        <div className="chat-dialogue" style={{ position: 'fixed', bottom: '80px', right: '20px', backgroundColor: 'white', width: '300px', height: '410px', borderRadius: '10px', boxShadow: '0px 2px 5px rgba(0,0,0,0.5)', zIndex: '999' }}>
          {/* Chat Header */}
          <div style={{ backgroundColor: '#581B98', color: 'white', padding: '10px', borderRadius: '10px 10px 0 0', fontWeight: 'bold' }}>
            <img src="/man.png" alt="man-icon" height={'35px'} />
              <span style={{marginLeft:'2%'}}>Chat support</span>
             </div>
          {/* Chat Messages */}
          <div style={{ overflowY: 'auto', height: '320px', padding: '10px' ,color:'black'}}>
            {/* <p style={
              {backgroundColor:'#dcdcdc',borderRadius:'5px',padding:'5px',width:'65%'}
            }>Hello </p>
            <p style={
              {backgroundColor:'#dcdcdc',borderRadius:'5px',padding:'5px',width:'65%'}
            }>How are you ? </p>
            
            <p style={
              {backgroundColor:'#581B98',borderRadius:'5px',padding:'5px',width:'65%',color:'white',marginLeft:'90px'}
            }>I'm good </p>
               <p style={
              {backgroundColor:'#dcdcdc',borderRadius:'5px',padding:'5px',width:'65%'}
            }>From which college you are ? </p>

<p style={
              {backgroundColor:'#581B98',borderRadius:'5px',padding:'5px',width:'65%',color:'white',marginLeft:'90px'}
            }>I'm from Manipal university</p> */}

            <p style={{fontSize:'0.8rem',textAlign:'center',backgroundColor:'#dcdcdc',borderRadius:'5px',padding:'4px'}}>
              <img src="/lock.png" alt="lock-img" height={'11px'} />
              Messages and calls are end-to-end encrypted.  No one outside of this chat,not even chatBuddy,can read or listen to them. </p>
            
            {/* {chatMessages.map((msg, index) => (
              <div style={{ marginBottom: '5px', marginLeft: '5px' }}>
                <strong>{msg.username}: </strong> 
                {msg.message}
              </div>
            ))} */}


           <div id="chat_messages" style={{display:'flex',flexDirection:"column"}}>
               
           </div>


          </div>
          {/* Chat Input and Send Button */}
          <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid #ddd' }}>
            <input className="custom-input"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ opacity: '1', flex: 1, padding: '5px', borderRadius: '5px', border: '1px solid #ddd', backgroundColor: '#581B98' }}
              placeholder="Type your message..."
            />
            <button
              style={{ color: '#581B98', marginLeft: '10px', padding: '5px 10px', borderRadius: '5px', marginRight: '5px', backgroundColor: '#581B98', color: 'white', border: 'none', cursor: 'pointer' }}
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}


    
    </>
  )
}