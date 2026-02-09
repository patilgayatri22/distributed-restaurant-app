import React from 'react';
import { Modal } from 'react-bootstrap';

const BookmarkModal = ({ bookmarks }) => {
  return (
    <Modal show={bookmarks.length > 0} onHide={() => {}}>
      <Modal.Header closeButton>
        <Modal.Title>Your Bookmarks</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul className="list-group">
          {bookmarks.map((bookmark, index) => (
            <li key={index} className="list-group-item">
              {bookmark}
            </li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={() => {}}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookmarkModal;
