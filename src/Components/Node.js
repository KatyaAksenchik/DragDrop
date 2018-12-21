import React from 'react';
import {MAX_NESTING_LEVEL, ITEM_TYPES} from '../Utils/Constants';
import {DragSource, DropTarget} from 'react-dnd';
import NodeTree from './NodeTree';

const source = {
  beginDrag(props) {
    return {
      id: props.node.id,
      parentId: props.node.parentId,
      tasks: props.node.tasks
    }
  },
  isDragging(props, monitor) {
    return props.node.id === monitor.getItem().id
  },
  endDrag(props, monitor) {
    const source = monitor.getItem();
    const target = monitor.getDropResult();

  }
};

const target = {
  canDrop() {
    return false
  },

  hover(props, monitor) {
    const {id: draggedId} = monitor.getItem();
    const overId = props.node.id;

    props.onMove(draggedId, overId, props.node.parentId)
  }
};


class Node extends React.Component {
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
    onOpenModal(node.parentId)
  };

  render() {
    const {node, level, connectDropTarget, connectDragSource, connectDragPreview} = this.props;
    const itemLevel = (level) ? level + 1 : 1;
    const nodeType = (itemLevel === 1) ? 'User' : 'Task';

    return connectDropTarget(connectDragPreview(
      // return(
      <div>
        {
          connectDragSource(
            <div className={`level__item level__item--${itemLevel}`}>
              <p className="level__item-title">
                {nodeType} "{node.title}" (Level {itemLevel}) {node.id}
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
                  itemLevel !== MAX_NESTING_LEVEL &&
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
            level={itemLevel}
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