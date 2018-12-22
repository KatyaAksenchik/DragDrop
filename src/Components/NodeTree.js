import React, {Component} from 'react';
import {DropTarget} from 'react-dnd';
import Node from './Node'
import {ITEM_TYPES} from '../Utils/Constants';


const target = {
  drop() {
  },

  hover(props, monitor) {
    const {id: draggedId, parent } = monitor.getItem();

    if (!monitor.isOver({shallow: true})) return;

    // const descendantNode = props.find(props.parent, items);
    // if (descendantNode) return;

    if (parent === props.parent || draggedId === props.parent) return;

    props.onMove(draggedId, props.node.id, props.node.parent);
  }
};

class NodeTree extends Component {
  render() {
    const {tasks, level, connectDropTarget, rerender } = this.props;

    return connectDropTarget(
      // return (
      <div className="level__container">
        {
          tasks && !!tasks.length && tasks.map((node, index) => {
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

export default DropTarget(ITEM_TYPES.NODE, target, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
}))(NodeTree);