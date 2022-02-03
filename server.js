const express= require('express');
const app= express()

const server= require('http').Server(app)

const io = require('socket.io')(server,
    {  cors: {    origin: "*",    
    methods: ["GET", "POST"] 
   }});


app.set('views' , './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))

const rooms ={ };

app.get('/', (req,res)=>{
    res.render('index', {rooms : rooms})
})

app.get('/:rooms', (req,res)=>{
  console.log("req-->",req.params);
    if(rooms[req.params.rooms] == null)
    {   console.log(req.params.rooms);
    return res.redirect('/');}
      console.log("HEllo")
      console.log( "YEH JA RHA HAI-->",{roomName : req.params.rooms })
    res.render('room', {roomName : req.params.rooms })
})

app.post('/room', (req,res)=>{
  
    if(rooms[req.body.room]!=null)
      return res.redirect('/');

      console.log(req.body);
    rooms[`${req.body.room}`]= {users : {}}
    console.log(rooms);
    res.redirect(req.body.room)


    //Send Message that new room is created
    io.emit('room-created',req.body.room)

})

server.listen(3000)


io.on('connection', socket=>{
    // socket.emit('chat-message', "Hello World")
    // console.log("*******************",socket);
    
    socket.on('new-user',(roomName,name)=>{
        socket.join(roomName);
        console.log("roomName and NAME and->",roomName, roomName.length,"-", name,typeof roomName,typeof name,rooms, typeof rooms ,rooms[roomName] )
        console.log(Object.keys(rooms))
        rooms[roomName].users[socket.id]= name
        socket.broadcast.to(roomName).emit('user-connected',name)
    })
    socket.on('send-chat-message',(roomName,message)=>{
        socket.broadcast.to(roomName).emit('chat-message',{message: message, name:  rooms[roomName].users[socket.id]});
    })

    socket.on('disconnect',name=>{
        getUserRooms(socket).forEach(roomName=>{
            socket.broadcast.to(roomName).emit('user-disconnected', rooms[roomName].users[socket.id])
            delete  rooms[roomName].users[socket.id]
        })
       
    })

})
function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room]) => {
      if (room.users[socket.id] != null) names.push(name)
      return names
    }, [])
}
