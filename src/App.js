import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {isNumber} from 'lodash';
import {Button} from 'reactstrap';
import {isEqual} from 'lodash';

import NodeTree from './Components/NodeTree';
import AddTaskModal from './Components/AddTaskModal';
import {
  initState,
  nextTaskId,
  findAndModifyParentTasks,
  onAddNewTaskRecursively,
  onDeleteTaskRecursively,
  modifyTaskVisibilityRecursively
} from './Utils/TasksState';

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

  onCollapse = (itemId) => {
    const modifiedTasks = modifyTaskVisibilityRecursively(this.state.tasks, itemId);

    this.setState(function (state) {
      return {
        tasks: modifiedTasks,
        rerender: !state.rerender
      }
    });
  };

  onDelete = (itemId) => {
    const modifiedTasks = onDeleteTaskRecursively(this.state.tasks, itemId);

    this.setState(function (state) {
      return {
        tasks: modifiedTasks,
        rerender: !state.rerender
      }
    });
  };

  toggleModal = (modifiedNodeId = null) => {
    this.setState((state) => {
      return {
        isOpenModal: !state.isOpenModal,
        modifiedNodeId: modifiedNodeId
      }
    });
  };

  onAddTask = (value, modifiedNodeId = null) => {
    const newTask = {
      id: nextTaskId(),
      title: value,
      isOpen: true,
      tasks: []
    };

    if (isNumber(modifiedNodeId)) {
      const modifiedTasks = onAddNewTaskRecursively(this.state.tasks, modifiedNodeId, newTask);

      this.setState((state) => {
        if (!isEqual(state.tasks, modifiedTasks)) {
          return {
            tasks: modifiedTasks,
            rerender: !state.rerender
          }
        }
      })

    } else {
      this.setState((state) => {
        return {
          tasks: [...state.tasks, newTask],
          rerender: !state.rerender
        }
      });
    }
  };

  onMove = (draggedTask, overTask) => {
    if (draggedTask.id === overTask.id) return;


    if (draggedTask.level > overTask.level) {
      let modifiedTasks = this.state.tasks.slice(0);
      const stateWithoutDraggedTask = onDeleteTaskRecursively(modifiedTasks, draggedTask.id);
      modifiedTasks = onAddNewTaskRecursively(stateWithoutDraggedTask, overTask.id, draggedTask);

      this.setState((state) => {
          return {
            tasks: modifiedTasks,
            rerender: !state.rerender
          }
      })
    }

    if (draggedTask.level === overTask.level) {
      let modifiedTasks = this.state.tasks.slice(0);
      modifiedTasks = findAndModifyParentTasks(modifiedTasks, overTask, draggedTask);

      this.setState((state) => {
          return {
            tasks: modifiedTasks,
            rerender: !state.rerender
          }
      })
    }
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
