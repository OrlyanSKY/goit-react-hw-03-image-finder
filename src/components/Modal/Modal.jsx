import { Component } from 'react';
import { ModalField, Overlay } from './Modal.styled';
import { createPortal } from 'react-dom';
const modalRoot = document.querySelector('#modal-root');

export class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.onKeydown);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeydown);
  }

  onKeydown = e => {
    if (e.key === 'Escape') {
      this.props.onClose();
    }
  };

  render() {
    return createPortal(
      <Overlay>
        <ModalField>
          <img src={this.props.image} alt="big" />
        </ModalField>
      </Overlay>,
      modalRoot
    );
  }
}
