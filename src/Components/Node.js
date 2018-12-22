import React, {Component} from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import NodeTree from './NodeTree';
import {MAX_NESTING_LEVEL, ITEM_TYPES} from '../Utils/Constants';

const source = {
  beginDrag(props) {
    return {
      id: props.node.id,
      parentId: props.node.parentId,
      tasks: props.node.tasks,
      level: props.level
    }
  },
  isDragging(props, monitor) {
    return props.node.id === monitor.getItem().id
  }
};

const target = {
  canDrop() {
    return false
  },

  hover(props, monitor) {
    const {id: draggedId} = monitor.getItem();

    const overId = props.node.id;
    const parentId = props.node.parentId;

    if (draggedId === overId ) return;
    if (!monitor.isOver({shallow: true})) return;

    props.onMove(draggedId, overId, parentId)
  }
};


class Node extends Component {
  onCollapse = () => {
    const {onCollapse, node} = this.props;
    onCollapse(node.id);
  };

  onDelete = () => {
    const {onDelete, node} = this.props;
    onDelete(node.id);
  };

  onOpenModal = () => {
    const {onOpenModal, node} = this.props;
    onOpenModal({
      id: node.id,
      parentId :node.parentId
    })
  };

  render() {
    const {node, level, connectDropTarget, connectDragSource, connectDragPreview} = this.props;
    const nodeLevel = (level) ? level + 1 : 1;
    const nodeType = (nodeLevel === 1) ? 'User' : 'Task';

    return connectDropTarget(connectDragPreview(
      <div>
        {
          connectDragSource(
            <div className={`level__item level__item--${nodeLevel}`}>
              <p className="level__item-title">
                {nodeType} "{node.title}" (Level {nodeLevel})
              </p>
              <div className="level_item_actions">
                <button
                  className="btn"
                  onClick={this.onDelete}
                >
                  X
                </button>
                <button
                  className="btn"
                  onClick={this.onOpenModal}
                >
                  +
                </button>
                {
                  nodeLevel !== MAX_NESTING_LEVEL &&
                  node.tasks &&
                  !!node.tasks.length &&
                  <button
                    className="btn"
                    onClick={this.onCollapse}
                  >
                    {node.isOpen ? 'V' : '>'}
                  </button>
                }
              </div>
            </div>
          )
        }
        {
          node.isOpen &&
          <NodeTree
            tasks={node.tasks}
            onDelete={this.props.onDelete}
            onOpenModal={this.props.onOpenModal}
            onCollapse={this.props.onCollapse}
            onMove={this.props.onMove}
            level={nodeLevel}
            rerender={this.props.rerender}
          />
        }
      </div>
      )
    );
  }
}

export default DropTarget(ITEM_TYPES.NODE, target, connect => ({
  connectDropTarget: connect.dropTarget()
}))(DragSource(ITEM_TYPES.NODE, source, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))(Node));