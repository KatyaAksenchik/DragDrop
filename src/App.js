import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {findAndDeleteFirst, findAndModifyFirst, findFirst, findAll} from 'obj-traverse/lib/obj-traverse';

import NodeTree from './Components/NodeTree';
import AddTaskModal from './Components/AddTaskModal';
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

  onAddTask = (value, taskData = null) => {
    TASKS_ENUM++;

    const newTask = {
      id: TASKS_ENUM,
      title: value,
      parentId: taskData.parentId,
      tasks: []
    };

    if (taskData.parentId !== null) {
      const parent = findAll(this.state, 'tasks', {id: taskData.parentId})[0];
      const insertedIndex = parent.tasks.findIndex((item) => item.id === taskData.id);
      const parentTasks = (parent.tasks.length) ? parent.tasks.splice(insertedIndex + 1, 0, newTask) : [newTask];

      const modifiedState = findAndModifyFirst(this.state, 'tasks', {id: taskData.parentId}, parent);
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
    if (id === overId) return;
    if(!parentId) return;

    const draggedElementIndex = findFirst(this.state, 'tasks', {id: parentId}).tasks.findIndex((item) => item.id === id);
    const draggedElement = findFirst(this.state, 'tasks', {id: id});

    const stateWithoutDeleteElement = findAndDeleteFirst(this.state, 'tasks', {id});
    const parent = findFirst(stateWithoutDeleteElement, 'tasks', {id: parentId});

    if(parent) {
      const overElementIndex = parent.tasks.findIndex((item) => item.id === overId);
      const insertIndex = (draggedElementIndex === overElementIndex + 1) ? overElementIndex  : overElementIndex + 1;
      parent.tasks.splice(insertIndex, 0, draggedElement);
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
          // we need rerender props because React DnD doesn't
          // fire rerender when nested elements changed
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
