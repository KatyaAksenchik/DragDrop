let idCounter = 0;

export function nextTaskId() {
  return idCounter++;
}

export function initState() {
  return [
    {
      id: nextTaskId(),
      title: 'Dave',
      isOpen: true,
      tasks: [
        {
          id: nextTaskId(),
          title: 'clean car',
          isOpen: true,
          tasks: [{
            id: nextTaskId(),
            title: 'clean wheels',
            tasks: []
          }, {
            id: nextTaskId(),
            title: 'clean windows',
            tasks: []
          }, {
            id: nextTaskId(),
            title: 'clean seats',
            tasks: []
          }
          ]
        }
      ]
    },
    {
      id: nextTaskId(),
      title: 'Clare',
      isOpen: true,
      tasks: [
        {
          id: nextTaskId(),
          title: 'clean car',
          isOpen: true,
          tasks: [{
            id: nextTaskId(),
            title: 'clean wheels',
            tasks: []
          }, {
            id: nextTaskId(),
            title: 'clean windows',
            tasks: []
          }, {
            id: nextTaskId(),
            title: 'clean seats',
            tasks: []
          }
          ]
        }
      ]
    }
  ];
}


export function findAndModifyParentTasks(tasksList, overTask, draggedTask) {
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
    if (task.tasks) {
      return {...task, tasks: findAndModifyParentTasks(task.tasks, overTask, draggedTask)}
    }
  })
}

export function onAddNewTaskRecursively(tasksList, taskId, newTask) {
  return tasksList.map((task) => {
    if (task.id === taskId) {
      return {...task, tasks: [...task.tasks, newTask]}
    }

    if (task.tasks) {
      return {...task, tasks: onAddNewTaskRecursively(task.tasks, taskId, newTask)}
    }

    return task;
  })
}

export function onDeleteTaskRecursively (tasksList, taskId) {
  return tasksList.reduce((result, task) => {
    if (task.id === taskId) {
      return result;
    }

    if (task.tasks) {
      return [...result, {...task, tasks: onDeleteTaskRecursively(task.tasks, taskId)}];
    }

    return [...result, task];
  }, [])
}

export function modifyTaskVisibilityRecursively (tasksList, taskId) {
  return tasksList.map((task) => {
    if (task.id === taskId) {
      return {...task, isOpen: !task.isOpen}
    }
    if (task.tasks) {
      return {...task, tasks: modifyTaskVisibilityRecursively(task.tasks, taskId)}
    }
    return task;
  })
}