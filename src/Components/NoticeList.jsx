import React, { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig/firebaseConfig';
import { onValue, ref, off, remove, update } from 'firebase/database';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const NoticeList = () => {
    
  const [data, setData] = useState([]);
  const [modalData, setModalData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const dbRef = ref(db, 'Notices');

      await onValue(dbRef, (snapshot) => {
        const cardsData = snapshot.val();
        const cardsArray = Object.keys(cardsData).map((key) => ({
          id: key,
          Text: cardsData[key].Text,
          Description: cardsData[key].Description,
          LongDescription: cardsData[key].LongDescription,
          Type: cardsData[key].Type,
          DateUploaded: cardsData[key].DateUploaded,
        }));
        setData(cardsArray);
      });
    };

    fetchData();

    return () => {
      const dbRef = ref(db, 'Notices');
      off(dbRef);
    };
  }, []);

  const handleDelete = (id) => {
    const dbRef = ref(db, `Notices/${id}`);
    remove(dbRef);
  };

  const handleEdit = (card) => {
    setModalData({ ...card });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    const { id, Description, LongDescription, Text, Type } = modalData;
 

    const dbRef = ref(db, `Notices/${id}`);
    update(dbRef, {
      Description: Description,
      LongDescription: LongDescription,
      Text: Text,
      Type: Type,
    });
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px',marginBottom:'5px'}}>
        {/* Refresh button */}
        <Button variant="primary">Refresh</Button>
        {/* Add New button */}
        <Link to="/AddNotice">
          <Button variant="primary">Add New</Button>
        </Link>
      </div>
      <div style={{padding:'10px', justifyContent: 'right', gap: '10px',marginBottom:'5px'}}>
      {data.map((card) => (
        <Card key={card.id} border="gray" style={{ borderWidth: '2px' }}  className=" mb-3">
          <Card.Body>
            <Card.Title>{card.Text}</Card.Title>
            <Card.Text>{card.Description}</Card.Text>
            <div style={{ display: 'flex', justifyContent: 'right', gap: '10px',marginBottom:'5px'}}>
            <Button variant="primary" onClick={() => handleEdit(card)}>
              Edit/View
            </Button>
            <Button variant="danger" onClick={() => handleDelete(card.id)}>
              Delete
            </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
      <Modal show={isModalOpen} size='xl' onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Notice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={modalData.Description}
              onChange={(e) =>
                setModalData({ ...modalData, Description: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Long Description</Form.Label>
            <Form.Control
              as="textarea"
              className='h-auto'
              rows={15}
              value={modalData.LongDescription}
              onChange={(e) =>
                setModalData({ ...modalData, LongDescription: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Text</Form.Label>
            <Form.Control
              type="text"
              value={modalData.Text}
              onChange={(e) =>
                setModalData({ ...modalData,
                Text: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select
              value={modalData.Type}
              onChange={(e) =>
                setModalData({ ...modalData, Type: e.target.value })
              }
            >
              <option value="Training">Training</option>
              <option value="Notice">Notice</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NoticeList;
