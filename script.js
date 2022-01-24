const socket = io('http://localhost:3000')

const messageForm= document.getElementById('send-container')
const messageContainer= document.getElementById('message-container')
const messageInput= document.getElementById('message-input')

const inputname= prompt('what is your name')
appendMessage('You Joined ')
socket.emit('new-user',inputname)
socket.on('chat-message', data=>{
    appendMessage(`${data.name} : ${data.message}`)
})

socket.on('user-connected', data=>{
    console.log("AAYA HAI " , data)
    appendMessage(`${data} connected`)
})

socket.on('user-disconnected', data=>{
    appendMessage(`${data} Disconnected`)
})

messageForm.addEventListener('submit', e=>{
    e.preventDefault();
    const message= messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message',message);
    messageInput.value=""
})

function appendMessage(message){
    const messageElement= document.createElement('div')
    messageElement.innerText= message
    messageContainer.append(messageElement)    
}