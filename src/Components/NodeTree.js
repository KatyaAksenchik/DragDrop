import React from 'react';
import {DropTarget, DragSource} from 'react-dnd';
import Node from './Node'
import {ITEM_TYPES} from "../Utils/Constants";


const nodeTreeSource = {
  beginDrag(props) {
    console.log("props", props)
    // return {
    //   id: props.nodeid,
    //   parent: props.parent,
    //   items: props.item.children
    // }
  },

  isDragging(props, monitor) {
  }
};

const nodeTreeTarget = {
  canDrop() {
    return false
  },

  hover(props, monitor) {
    // console.log("hover", props, monitor )
  }
};

export default class NodeTree extends React.Component {
  onCollapse = () => {
    const {onCollapseChildren, index} = this.props;
    onCollapseChildren(index);
  };

  onDelete = () => {
    const {onDelete, index} = this.props;
    onDelete(index);
  };

  onOpenAddModal = () => {
    const {onOpenAddModal, node} = this.props;
    onOpenAddModal(node.parentId)
  };

  render() {
    const {level, node, children, isOpenTasks, connectDropTarget, connectDragPreview, connectDragSource} = this.props;
    let childnodes = null;
    const levelInfo = level ? {
      num: level + 1,
      type: 'Task'
    } : {
      num: 1,
      type: 'User'
    };

    if (children) {
      childnodes = children.map((childnode, index) => {
        return (
          <NodeTree
            node={childnode}
            children={childnode.tasks}
            index={childnode.id}
            isOpenTasks={childnode.isOpen}
            onCollapseChildren={this.props.onCollapseChildren}
            onDelete={this.props.onDelete}
            onOpenAddModal={this.props.onOpenAddModal}
            level={levelInfo.num}
          />
        );
      });
    }

    return (
      <div key={node.id}>
          <Node
            level={level}
            node={node}
            isOpenTasks={isOpenTasks}
          />
        {childnodes && isOpenTasks ?
          <div className="level__container">{childnodes}</div>:
          null
        }
      </div>
    );
  }
}

// const NodeTreeWrapper = DropTarget(ITEM_TYPES.NODE, nodeTreeTarget, connect => ({
//   connectDropTarget: connect.dropTarget()
// }))(NodeTree);
//
// export default DragSource(ITEM_TYPES.NODE, nodeTreeSource, (connect, monitor) => ({
//   connectDragSource: connect.dragSource(),
//   connectDragPreview: connect.dragPreview(),
//   isDragging: monitor.isDragging()
// }))(NodeTreeWrapper)
