import React from 'react';
import io from 'socket.io-client';
import uuid from 'uuid';

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {tasks: [], newTask: ''};
  }

  componentDidMount() {
    this.socket = io('localhost:8000');
    //get existing tasks from server
    this.socket.on('updateTasks', (tasks) => this.updateTasks(tasks));
    //remove task
    this.socket.on('removeTask', (id) => this.removeTask(id));
    //add new task
    this.socket.on('addTask', (task) => this.addTask(task));
    //change task
    this.socket.on('changeTask', (changedTask) => {      
      this.changeTask(changedTask.id, changedTask.name);
    });
  }

  updateTasks(newTasks) {
    this.setState({
      tasks: newTasks,
    });
  };

  addTask(newTask){
    this.setState({
      tasks: [...this.state.tasks, newTask],
    });
  }

  removeTask(taskId, taskName = null){
    this.setState({
      tasks: this.state.tasks.filter(val => val.id !== taskId),
    });
    console.log(this.state.tasks);
    //task name works as filter to avoid infinity loop on sockets, it is only passed from component but not from server so socket emits only form user that removes task.
    if(taskName) this.socket.emit('removeTask', taskId);
  }

  submitForm(e){
    e.preventDefault();
    const newTask = {
      id: uuid.v4(),
      name: this.state.newTask,
    }
    this.addTask(newTask);    
    this.socket.emit('addTask', newTask);
    this.setState({newTask: ''});
  }

  changeTask(taskId, newName, emit=false){  
      
    this.setState({      
      tasks: this.state.tasks.map(val => {
        if(val.id === taskId){
          val.name = newName;
          console.log(val.id, taskId, newName, val);
        }
        return val;
      })
    });
           
    if(emit) {
      this.socket.emit('changeTask', taskId, newName);      
    };
  }

  
  render() {
    const {newTask} = this.state;
    console.log(this.state.tasks[0]);
    return (

      <div className="App">
    
        <header>
          <h1>ToDoList</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map(task => (              
              <li key={task.id} className='task'>
                <input type="text" className='task_input' value={task.name} onChange={e => {
                  const newName = e.currentTarget.value;
                  this.changeTask(task.id, newName, true)}}></input>                
                <button className="btn btn--red" onClick={() => this.removeTask(task.id, task.name)}>Remove</button>
              </li>
            ))}
          </ul>
          <form 
          id="add-task-form"
          onSubmit={event => this.submitForm(event)}
          >
            <input 
            className="text-input" 
            autoComplete="off" 
            type="text" 
            placeholder="Type your description" 
            id="task-name"
            value={newTask} 
            onChange={e => this.setState({newTask: e.currentTarget.value})}
            />
            <button className="btn" type="submit">Add</button>
          </form>    
        </section>
      </div>
    );
  };

};

export default App;