export const MAX_NESTING_LEVEL = 3;

export const INITIAL_TASKS_STATE = [
  {
    id: 0,
    title: 'Dave',
    isOpen: true,
    parentId: null,
    tasks: [
      {
        id: 1,
        title: 'clean car',
        isOpen: true,
        parentId: 0,
        tasks: [{
          id: 2,
          title: 'clean wheels',
          parentId: 1
        }, {
          id: 3,
          title: 'clean windows',
          parentId: 1
        }, {
          id: 4,
          title: 'clean seats',
          parentId: 1
        }
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Clare',
    isOpen: true,
    parentId: null,
    tasks: [
      {
        id: 6,
        title: 'clean car',
        isOpen: true,
        parentId: 5,
        tasks: [{
          id: 7,
          title: 'clean wheels',
          parentId: 6
        }, {
          id: 8,
          title: 'clean windows',
          parentId: 6
        }, {
          id: 9,
          title: 'clean seats',
          parentId: 6
        }
        ]
      }
    ]
  }
];

export const ITEM_TYPES = {
  NODE: 'node'
};