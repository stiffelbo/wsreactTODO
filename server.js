const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

//task array
let tasks = [
  {id: 1, name: "Learn array functions"},
  {id: 2, name: "Learn react components"},
  {id: 3, name: "Learn redux"},
  {id: 4, name: "Learn web sockets"},
  {id: 5, name: "Learn mongo"},
  {id: 6, name: "Learn backend tests"},
  {id: 7, name: "Learn security"},
];

//task methods

const addTask = (task) =>{  
  tasks.push(task);
}

const removeTask = (taskId) =>{
  tasks = tasks.filter(task => task.id !== taskId);
}

const changeTask = (id, newName) => {
  tasks.forEach(val => {
    if(val.id === id){
      val.name = newName;
      console.log('update value: ', newName, "task: ", id);
    }
  });
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client')));

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on Port:', 8000)
});

//web sockets
const io = socket(server);
io.on('connection', (socket) => { 

  socket.emit('updateTasks', tasks);
  
  socket.on('addTask', (task) => {    
    addTask(task);        
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', (id) => {     
    removeTask(id);
    socket.broadcast.emit('removeTask', id);
  });
  socket.on('changeTask', (taskId, newName) => {     
    changeTask(taskId, newName);
    const changedTask = {id: taskId, name: newName}    
    socket.broadcast.emit('changeTask', changedTask);
  });
  socket.on('disconnect', () => { 
    const id = socket.id;
    console.log('disconected: ', id);
  });
  console.log(`new client connected: ${socket.id}`);
});