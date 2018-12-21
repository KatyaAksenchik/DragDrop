import React from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';


export default class AddTaskModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  };


  handleSubmit = () => {
    this.state.value && this.props.onAddTask(this.state.value, this.props.level);
    this.onClose();
  };

  onClose = () => {
    const {onClose} = this.props;
    onClose();
    this.setState({
      value: ''
    })
  };

  render() {

    return (
      <Modal isOpen={this.props.isOpen} toggle={this.onClose}>
        <ModalHeader toggle={this.onClose}>Add task</ModalHeader>
        <ModalBody>
            <label className="modal__label">
              Enter task title:
            </label>
          <input
            type="text"
            className="modal_input"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.handleSubmit}>
            Submit
          </Button>
          <Button onClick={this.onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}