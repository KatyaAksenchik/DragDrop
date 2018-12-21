import React from 'react';
import {DropTarget} from 'react-dnd';
import Node from './Node'
import {ITEM_TYPES} from '../Utils/Constants';


const target = {
  drop() {
  },

  hover(props, monitor) {
    const {...params} = monitor.getItem();

    // if (!monitor.isOver({shallow: true})) return
    //
    // const descendantNode = props.find(props.parent, items)
    // if (descendantNode) return
    // if (parent == props.parent || draggedId == props.parent) return
    //
    // props.move(draggedId, props.id, props.parent)
  }
};

class NodeTree extends React.Component {
  render() {
    const {tasks, level, connectDropTarget} = this.props;

    // return connectDropTarget(
    return (
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
            />
          })
        }
      </div>
    )
  }
}

// NodeTree = DropTarget(ITEM_TYPES.NODE, target, (connect, monitor) => ({
//   connectDropTarget: connect.dropTarget()
// }))(NodeTree);

export default NodeTree;
