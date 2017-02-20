import React, {Component, PropTypes} from 'react';

export default class Modal extends Component {
  static propTypes = {
    closePopUp: PropTypes.func,
    title: PropTypes.string.isRequired,
    content: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context);
    this.closeModalWithKeyPress = this.closeModalWithKeyPress.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModalWithKeyPress(event) {
    if (event.keyCode === 27) {
      if (this.props.closePopUp) {
        this.props.closePopUp();
      }
    }
  }

  closeModal(eve) {
    eve.stopPropagation();
    if (eve.target.classList.contains('js-sz-modal-container') || eve.target.classList.contains('js-sz-modal-close-icon')) {
      this.props.closePopUp();
    }
  }

  render() {
    const modalStyles = require('./Modal.scss');
    const libStyles = require('../../styles/library.scss');

    let titleHtml = '';
    let closeButton;

    if (this.props.title) {
      titleHtml = <div className={modalStyles.modalHeader}>{this.props.title}</div>;
    }

    if (this.props.closePopUp) {
      closeButton =
        (<div className={modalStyles.modalClose}>
          <button className={modalStyles.modalCloseIcon + ' js-sz-modal-close-icon'} onClick={this.closeModal}>&times;</button>
        </div>);
    }

    return (
      <div className={modalStyles.modalContainer + ' js-sz-modal-container'}>
        <div className={modalStyles.modalBody + ' ' + libStyles.pageCenter}>
          {titleHtml}
          <div className={modalStyles.modalContent}>
            {this.props.content}
          </div>
          {closeButton}
        </div>
      </div>
    );
  }
}
