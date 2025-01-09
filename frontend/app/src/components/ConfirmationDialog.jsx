import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { confirmable } from 'react-confirm';

const ConfirmationDialog = (props) => (
  <Modal show={props.show} onHide={() => props.proceed(false)} backdrop="static">
    <Modal.Header closeButton>
      <Modal.Title>{props.title || 'Confirm'}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{props.confirmation || 'Are you sure?'}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => props.proceed(false)}>
        {props.cancelLabel || 'Cancel'}
      </Button>
      <Button variant="primary" onClick={() => props.proceed(true)}>
        {props.okLabel || 'OK'}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default confirmable(ConfirmationDialog);
