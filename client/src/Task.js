import React from 'react';
import PropTypes from 'prop-types';

export default class Task extends React.Component {
  
  changeTaskOnState(id, name){

    const tasks = this.state.tasks.map(val => {
      if(val.id === id){
        val.name = name;
      }
      return val;
    })
    this.setState({
      newTask: this.state.newTask,
      tasks: tasks
    });
    console.log(this.state);
  }

  render() {
    return (
      <li key={this.props.id} className='task'>
          <input type="text" className='task_input' defaultValue={this.props.name} onChange={e => this.props.changeTask(e, this.props.id, true)}></input>                
          <button className="btn btn--red" onClick={() => this.props.removeTask(this.props.id, this.props.name)}>Remove</button>
      </li>
    )
  }
  } 

Task.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  changeTask: PropTypes.func,
  removeTask: PropTypes.func,
}



