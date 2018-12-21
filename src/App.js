import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import NodeTree from './Components/NodeTree';
import AddTaskModal from './Components/AddTaskModal'
import {findAndDeleteFirst, findAndModifyFirst, findFirst} from 'obj-traverse/lib/obj-traverse';
import {INITIAL_TASKS_STATE} from './Utils/Constants';


let TASKS_ENUM = INITIAL_TASKS_STATE.length;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenModal: false,
      currentModifiedLevel: null,
      tasks: INITIAL_TASKS_STATE
    }
  }

  onCollapse = (itemId) => {
    const task = findFirst(this.state, 'tasks', {id: itemId});
    const modifiedState = findAndModifyFirst(this.state, 'tasks', {id: itemId}, {...task, isOpen: !task.isOpen});
    this.setState(modifiedState);
  };

  onDelete = (itemId) => {
    const modifiedState = findAndDeleteFirst(this.state, 'tasks', {id: itemId});
    this.setState(modifiedState);
  };

  toggleModal = (currentModifiedLevel = null) => {
    this.setState({
      isOpenModal: !this.state.isOpenModal,
      currentModifiedLevel: currentModifiedLevel
    });
  };

  onAddTask = (value, parentId = null) => {
    TASKS_ENUM++;
    const newTask = {
      id: TASKS_ENUM,
      title: value,
      parentId: parentId,
      tasks: null
    };

    if (parentId !== null) {
      const parent = findFirst(this.state, 'tasks', {id: parentId});
      const parentTasks = (parent.tasks.length) ? [...parent.tasks, newTask] : [newTask];

      const modifiedState = findAndModifyFirst(this.state, 'tasks', {id: parentId}, {...parent, tasks: parentTasks});
      this.setState(modifiedState);
    } else {
      this.setState({
        tasks: [...this.state.tasks, newTask]
      })
    }
  };

  onMove = (id, overId, parentId) => {
    const draggedElement = findFirst(this.state, 'tasks', {id: parentId});
    const stateWithoutDeleteElement = findAndDeleteFirst(this.state, 'tasks', {id});
    const parent = findFirst(this.state, 'tasks', {id: parentId});

    if(parent) {
      const overElementIndex = parent.tasks.findIndex((item) => item.id === overId);
      const newParentArray = parent.tasks.splice(overElementIndex, 0, draggedElement);
      const modifiedState = findAndModifyFirst(this.state.tasks, 'tasks', {id: parentId}, {...parent, tasks: newParentArray});

      this.setState(modifiedState)
    }
  };

  render() {
    return (
      <div className="app">
        <NodeTree
          tasks={this.state.tasks}
          onDelete={this.onDelete}
          onOpenModal={this.toggleModal}
          onCollapse={this.onCollapse}
          onMove={this.onMove}
        />

        <AddTaskModal
          isOpen={this.state.isOpenModal}
          onClose={this.toggleModal}
          onAddTask={this.onAddTask}
          level={this.state.currentModifiedLevel}
        />
      </div>
    );
  }
}

export default App;
