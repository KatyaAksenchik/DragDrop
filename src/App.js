import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {isNumber} from 'lodash';
import {Button} from 'reactstrap';

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

    this.setState({
      tasks: modifiedTasks,
      rerender: !this.state.rerender
    });
  };

  onDelete = (itemId) => {
    const modifiedTasks = onDeleteTaskRecursively(this.state.tasks, itemId);

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

  onAddTask = (value, modifiedNodeId = null) => {
    const newTask = {
      id: nextTaskId(),
      title: value,
      isOpen: true,
      tasks: []
    };

    if (isNumber(modifiedNodeId)) {
      const modifiedTasks = onAddNewTaskRecursively(this.state.tasks, modifiedNodeId, newTask);

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

  onMove = (draggedTask, overTask) => {
    if (draggedTask.id === overTask.id) return;
    let modifiedState = this.state.tasks.slice(0);

    if (draggedTask.level > overTask.level) {
      const stateWithoutDraggedTask = onDeleteTaskRecursively(this.state.tasks, draggedTask.id);
      modifiedState = onAddNewTaskRecursively(stateWithoutDraggedTask, overTask.id, draggedTask)
    }

    if (draggedTask.level === overTask.level) {
      modifiedState = findAndModifyParentTasks(this.state.tasks, overTask, draggedTask);
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
