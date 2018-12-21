import React from 'react';
import {MAX_NESTING_LEVEL} from '../Utils/Constants';
import {DragSource} from 'react-dnd';

const ItemTypes = {
  NODE: 'node'
};

const nodeSource = {
  beginDrag(props) {
    return {};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class NodeTree extends React.Component {
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
    const {level, node, children, isOpenTasks} = this.props;
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
        {childnodes && isOpenTasks ? <div className="level__container">{childnodes}</div> : null}
      </div>
    );
  }
}

class Node extends React.Component {
  render() {
    const {level, node, isOpenTasks} = this.props;
    let childnodes = null;
    const levelInfo = level ? {
      num: level + 1,
      type: 'Task'
    } : {
      num: 1,
      type: 'User'
    };

    return this.props.connectDragSource(
      <div className={`level__item level__item--${levelInfo.num}`}>
        <p className="level__item-title">
          {levelInfo.type} "{node.title}" (Level {levelInfo.num})
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
            onClick={this.onOpenAddModal}
          >
            +
          </button>
          {
            levelInfo.num !== MAX_NESTING_LEVEL &&
            <button
              className="btn"
              onClick={this.onCollapse}
            >
              { isOpenTasks ? 'V' : '>' }
            </button>
          }

        </div>
      </div>);
  }
}

Node = DragSource(ItemTypes.NODE, nodeSource, collect)(Node);

export default NodeTree;