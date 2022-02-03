const socket = io('http://localhost:3000')

const messageForm= document.getElementById('send-container')
const messageContainer= document.getElementById('message-container')
const roomContainer= document.getElementById('room-container')
const messageInput= document.getElementById('message-input')

if(messageForm!= null)
{
    const inputname= prompt('what is your name')
    appendMessage('You Joined ')
    socket.emit('new-user',roomName,inputname)

        messageForm.addEventListener('submit', e=>{
        e.preventDefault();
        const message= messageInput.value
        appendMessage(`You: ${message}`)
        socket.emit('send-chat-message',roomName,message);
        messageInput.value=""
    })
    
}

socket.on('room-created', room=>{
    const roomElement = document.createElement('div');
    roomElement.innerText = room
    const roomLink = document.createElement('a')
    roomLink.href= `/${room}`
    roomLink.innerText = "Join"

    roomContainer.append(roomElement);
    roomContainer.append(roomLink);
})

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


function appendMessage(message){
    const messageElement= document.createElement('div')
    messageElement.innerText= message
    messageContainer.append(messageElement)    
}