import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {Button} from 'reactstrap';
import {isNumber} from 'lodash';

import NodeTree from './Components/NodeTree';
import AddTaskModal from './Components/AddTaskModal';
import {initState, nextTaskId} from './Utils/TasksState';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenModal: false,
      modifiedNodeId: null,
      tasks: initState(),
      rerender: false
    }
  }

  modifyTaskVisibility = (tasksList, taskId) => {
    return tasksList.map((task) => {
      if (task.id === taskId) {
        return {...task, isOpen: !task.isOpen}
      }

      if (task.tasks) {
        return {...task, tasks: this.modifyTaskVisibility(task.tasks, taskId)}
      }

      return task;
    })
  };

  onCollapse = (itemId) => {
    const modifiedTasks = this.modifyTaskVisibility(this.state.tasks, itemId);

    this.setState({
      tasks: modifiedTasks,
      rerender: !this.state.rerender
    });
  };

  onDeleteTask = (tasksList, taskId) => {
    return tasksList.reduce((result, task) => {
      if (task.id === taskId) {
        return result;
      }

      if (task.tasks) {
        return [...result, {...task, tasks: this.onDeleteTask(task.tasks, taskId)}];
      }

      return [...result, task];
    }, [])
  };

  onDelete = (itemId) => {
    const modifiedTasks = this.onDeleteTask(this.state.tasks, itemId);

    this.setState({
      tasks: modifiedTasks,
      rerender: !this.state.rerender
    });
  };

  toggleModal = (modifiedNodeId = null) => {
    this.setState({
      isOpenModal: !this.state.isOpenModal,
      modifiedNodeId: modifiedNodeId
    });
  };

  onAddNewTask = (tasksList, taskId, newTask) => {
    return tasksList.map((task) => {
      if (task.id === taskId) {
        return {...task, tasks: [...task.tasks, newTask]}
      }

      if (task.tasks) {
        return {...task, tasks: this.onAddNewTask(task.tasks, taskId, newTask)}
      }

      return task;
    })
  };

  onAddTask = (value, modifiedNodeId = null) => {
    const newTask = {
      id: nextTaskId(),
      title: value,
      isOpen: true,
      tasks: []
    };

    if (isNumber(modifiedNodeId)) {
      const modifiedTasks = this.onAddNewTask(this.state.tasks, modifiedNodeId, newTask);

      this.setState({
        tasks: modifiedTasks,
        rerender: !this.state.rerender
      });
    } else {
      this.setState({
        tasks: [...this.state.tasks, newTask],
        rerender: !this.state.rerender
      })
    }
  };

  findAndModifyParentTasks = (tasksList, overTask, draggedTask) => {
    const draggedTaskIndex = tasksList.findIndex((item) => item.id === draggedTask.id);
    const overTaskIndex = tasksList.findIndex((item) => item.id === overTask.id);

    if (overTaskIndex !== -1 && draggedTaskIndex !== -1) {
      let updatedList = tasksList.slice(0);

      updatedList.splice(draggedTaskIndex, 1);
      const insertedIndex = (draggedTaskIndex > overTaskIndex) ? overTaskIndex : overTaskIndex + 1;
      updatedList.splice(insertedIndex, 0, draggedTask);
      return updatedList;
    }

    if (overTaskIndex !== -1 && draggedTaskIndex === -1) {
      return [...tasksList, draggedTask]
    }

    if (draggedTaskIndex !== -1 && overTaskIndex === -1) {
      let updatedList = tasksList.slice(0);
      updatedList.splice(draggedTaskIndex, 1);
      return updatedList;
    }

    return tasksList.map((task) => {
      if(task.tasks) {
        return {...task, tasks: this.findAndModifyParentTasks(task.tasks, overTask, draggedTask) }
      }
    })
  };

  onMove = (draggedTask, overTask) => {
    if (draggedTask.id === overTask.id) return;
    let modifiedState = this.state.tasks.slice(0);

    if (draggedTask.level !== overTask.level) {
      const stateWithoutDraggedTask = this.onDeleteTask(this.state.tasks, draggedTask.id);
      modifiedState = this.onAddNewTask(stateWithoutDraggedTask, overTask.id, draggedTask)
    }

    if (draggedTask.level === overTask.level) {
      modifiedState = this.findAndModifyParentTasks(this.state.tasks, overTask, draggedTask);
    }

    this.setState({
      tasks: modifiedState,
      rerender: !this.state.rerender
    })

  };

  render() {
    return (
      <div className="app">
        <Button
          color="primary"
          onClick={this.toggleModal}
        >
          Add user
        </Button>
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
          level={this.state.modifiedNodeId}
        />
      </div>
    );
  }
}

export default App;
