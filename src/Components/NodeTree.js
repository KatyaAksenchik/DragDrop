import React, {Component} from 'react';
import {DropTarget} from 'react-dnd';
import classNames from 'classnames';
import Node from './Node'
import {ITEM_TYPES} from '../Utils/Constants';


const target = {
  canDrop() {
    return false
  },
  hover(props, monitor) {
    const draggedTask = monitor.getItem();
    const overTask = {...props.node, level: props.level};

    if (draggedTask.id === overTask.id) return;
    if (!monitor.isOver({shallow: true})) return;
  }
};

class NodeTree extends Component {
  render() {
    const {tasks, level, connectDropTarget, rerender } = this.props;
    const nodeTreeClasses = classNames({
      'level__container': true
    });

    return connectDropTarget(
      <div className={nodeTreeClasses}>
        {
          tasks && !!tasks.length && tasks.map((node) => {
            return <Node
              key={node.id}
              node={node}
              onDelete={this.props.onDelete}
              onOpenModal={this.props.onOpenModal}
              onCollapse={this.props.onCollapse}
              level={level}
              onMove={this.props.onMove}
              rerender={rerender}
            />
          })
        }
      </div>
    )
  }
}

export default DropTarget(ITEM_TYPES.NODE, target, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))(NodeTree);
