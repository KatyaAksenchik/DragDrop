import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import NodeTree from './Components/NodeTree';
import AddTaskModal from './Components/AddTaskModal'
import {findAndDeleteFirst, findAndModifyFirst, findFirst, findAll} from 'obj-traverse/lib/obj-traverse';
import {INITIAL_TASKS_STATE} from './Utils/Constants';

let TASKS_ENUM = 9;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenModal: false,
      currentModifiedLevel: null,
      tasks: INITIAL_TASKS_STATE,
      rerender: false
    }
  }

  onCollapse = (itemId) => {
    const task = findFirst(this.state, 'tasks', {id: itemId});
    const modifiedState = findAndModifyFirst(this.state, 'tasks', {id: itemId}, {...task, isOpen: !task.isOpen});
    this.setState({
      tasks: modifiedState.tasks,
      rerender: !this.state.rerender
    });
  };

  onDelete = (itemId) => {
    const modifiedState = findAndDeleteFirst(this.state, 'tasks', {id: itemId});
    this.setState({
      tasks: modifiedState.tasks,
      rerender: !this.state.rerender
    });
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
      tasks: []
    };

    if (parentId !== null) {
      const parent = findAll(this.state, 'tasks', {id: parentId})[0];
      const parentTasks = (parent.tasks.length) ? [...parent.tasks, newTask] : [newTask];

      const modifiedState = findAndModifyFirst(this.state, 'tasks', {id: parentId}, {...parent, tasks: parentTasks});
      this.setState({
        tasks: modifiedState.tasks,
        rerender: !this.state.rerender
      });
    } else {
      this.setState({
        tasks: [...this.state.tasks, newTask],
        rerender: !this.state.rerender
      })
    }
  };

  onMove = (id, overId, parentId) => {
    console.log("onMove", id, overId, parentId);
    if (id === overId) return;

    const draggedElement = findFirst(this.state, 'tasks', {id: id});
    const stateWithoutDeleteElement = findAndDeleteFirst(this.state, 'tasks', {id});

    const parent = findFirst(stateWithoutDeleteElement, 'tasks', {id: parentId});


    if(parent) {
      const overElementIndex = parent.tasks.findIndex((item) => item.id === overId);
      parent.tasks.splice(1, 0, draggedElement);
      const modifiedState = findAndModifyFirst(this.state, 'tasks', {id: parentId},  parent );

      modifiedState !== false && this.setState({
        tasks: modifiedState.tasks,
        rerender: !this.state.rerender
      })
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
          rerender={this.state.rerender}
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
