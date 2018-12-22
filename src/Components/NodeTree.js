import React, {Component} from 'react';
import {DropTarget} from 'react-dnd';
import Node from './Node'
import {ITEM_TYPES} from '../Utils/Constants';


const target = {
  drop() {},
  hover(props, monitor) {
    const {id: draggedId, parent } = monitor.getItem();

    if (!monitor.isOver({shallow: true})) return;

    if (parent === props.parent || draggedId === props.parent) return;
    props.onMove(draggedId, props.node.id, props.node.parent);
  }
};

class NodeTree extends Component {
  render() {
    const {tasks, level, connectDropTarget, rerender } = this.props;
    const levelUnitLine = (tasks.length > 1 && level === 1)? 'level_container--connected' : '';

    return connectDropTarget(
      <div className={`level__container ${levelUnitLine}`}>
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