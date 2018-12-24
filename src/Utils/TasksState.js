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
