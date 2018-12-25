import React, {Component} from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import classNames from 'classnames';
import NodeTree from './NodeTree';
import {MAX_NESTING_LEVEL, ITEM_TYPES} from '../Utils/Constants';

const source = {
  beginDrag(props) {
    return {...props.node, level: props.level};
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
    const draggedTask = monitor.getItem();
    const overTask = {...props.node, level: props.level};

    if (draggedTask.id === overTask.id) return;
    if (!monitor.isOver({shallow: true})) return;
    props.onMove(draggedTask, overTask)
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
    onOpenModal(node.id)
  };

  render() {
    const {node, level = 0, isDragging, connectDropTarget, connectDragSource, connectDragPreview} = this.props;
    const nodeLevel = level + 1;
    const nodeType = (nodeLevel === 1) ? 'User' : 'Task';
    const nodeContainerClasses = classNames({
      'level__item': true,
      'level__item--is-dragging': isDragging,
    }, [`level__item--${nodeLevel}`]);

    return connectDropTarget(connectDragPreview(
      <div>
        {
          connectDragSource(
            <div className={nodeContainerClasses}>
              <p className="level__item-title">
                {nodeType} "{node.title}" (Level {nodeLevel}) {node.id}
              </p>
              <div className="level_item_actions">
                <button
                  className="btn"
                  onClick={this.onDelete}
                >
                  X
                </button>
                {
                  nodeLevel !== MAX_NESTING_LEVEL &&
                  <button
                    className="btn"
                    onClick={this.onOpenModal}
                  >
                    +
                  </button>
                }
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