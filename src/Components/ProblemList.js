import React, { useState, useEffect } from 'react';
import { db,storage } from '../FirebaseConfig/firebaseConfig';
import { onValue, ref, off, remove, update } from 'firebase/database';
import { Card, Button, Modal, Form,Toast,ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import {  ref as storageRef,getMetadata, deleteObject, uploadBytesResumable,getDownloadURL } from 'firebase/storage';

const CropIssues = () => {
    
  const [data, setData] = useState([]);
  const [modalData, setModalData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStarted, setUploadStarted] = useState(false);
  const [urls, setUrls] = useState([]);
  const [updatedItemId, setUpdatedItemId] = useState(null);  
  const [uploadProgress, setUploadProgress] = useState(0); // Progress of the file upload


  useEffect(() => {
    const fetchData = async () => {
      const dbRef = ref(db, 'CropIssues');

      await onValue(dbRef, (snapshot) => {
        const cardsData = snapshot.val();
        const cardsArray = Object.keys(cardsData).map((key) => ({
          id: key,
          Title: cardsData[key].Title,
          Catagory: cardsData[key].Catagory,
          KeyWords: cardsData[key].KeyWords,
          Symptoms: cardsData[key].Symptoms,
          Treatments: cardsData[key].Treatments,
          Causes: cardsData[key].Causes,
          Prevention:cardsData[key].Prevention,
          ImageFileName: cardsData[key].ImageFileName,
          Id:cardsData[key].Id,
          isUpdated: updatedItemId === key // Check if the item was updated
        }));
        setData(cardsArray);
      });
    };

    fetchData();

    return () => {
      const dbRef = ref(db, 'CropIssues');
      off(dbRef);
    };
  }, [updatedItemId]);

  const handleDelete = (id) => {
    const dbRef = ref(db, `CropIssues/${id}`);
    remove(dbRef);
  };

  const handleEdit = (card) => {
    setModalData({ ...card });
    const fetchImages = async () => {
        const sRef = await storageRef(storage, `CropIssuesPhotos/${card.ImageFileName}`);
      
        const urlPromises = getDownloadURL(sRef);
      
        return Promise.resolve(urlPromises);
      };
      const loadImages = async () => {
        const _urls = await fetchImages();
        console.log("url",_urls)
        setUrls(_urls);
      };
        loadImages()
    setIsModalOpen(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setModalData((prevForm) => ({ ...prevForm, ImageFileName: file ? file.name : '' }));

  };



  const handleSubmit = async () => {
    const { id,Id, Title, KeyWords, Symptoms,Treatments,Prevention,Causes } = modalData;

    const dbRef = ref(db, `CropIssues/${id}`);
    update(dbRef, {
      Title: Title,
      KeyWords: KeyWords,
      Symptoms: Symptoms,
      Treatments: Treatments,
      Prevention:Prevention,
      Causes: Causes,
      ImageFileName: Id,
      DateUploaded: new Date().toLocaleString()
    });

    if (selectedFile) {
    setUploadStarted(true)
      uploadImageToFirebase(Id);
    }

    setUpdatedItemId(id); // Set the updated item ID
    setIsModalOpen(false);
  };
  const uploadImageToFirebase = async (Id) => {
    // Create a reference to the storage folder

    
    // Check if a file with the same name already exists
    const fileRef = storageRef(storage, `CropIssuesPhotos/${Id}`);
    const fileExists = await getMetadata(fileRef)
      .then(() => true)
      .catch(() => false);
    
    // If the file exists, delete it
    if (fileExists) {
      await deleteObject(fileRef);
      console.log('Existing file deleted');
    }
    
    const uploadTask = uploadBytesResumable(fileRef, selectedFile);
    
    uploadTask.on('state_changed',
      (snapshot) => {
        // Track the upload progress if needed
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadStarted(false)
        setUploadProgress(progress);
        console.log(`Upload is ${progress}% complete`);
      },
      (error) => {
        // Handle any errors during the upload
        console.error('Upload error:', error);
      },
      () => {
        // Upload completed successfully
        console.log('File uploaded successfully');
        setUploadProgress(0); // Reset the progress state
      }
    );
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
        <Link to="/AddCropIssue">
          <Button variant="primary">Add New</Button>
        </Link>
      </div>
      <div style={{padding:'10px', justifyContent: 'right', gap: '10px',marginBottom:'5px'}}>
      {data.map((card) => (
        <Card key={card.id} border="gray" style={{ borderWidth: '2px' }}  className=" mb-3">
          <Card.Body>
            <Card.Title>{card.Title}</Card.Title>
            <Card.Text><b>Catagory: </b>{card.Catagory}</Card.Text>
            <Card.Text><b>Keywords: </b>{card.KeyWords}</Card.Text>
               {/* Progress Bar */}
               {uploadProgress > 0 && card.id === modalData.id && (
              <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
            )}

                   {/* Notification Toast */}
                   {card.isUpdated && uploadProgress ===0 && ~uploadStarted && (
              <Toast
                show={true}
                onClose={() => setUpdatedItemId(null)}
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                <Toast.Header className='bg-success'>
                  <strong className="me-auto">Success</strong>
                </Toast.Header>
                <Toast.Body>Item Updated Successfully!</Toast.Body>
              </Toast>
            )}
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
          <Modal.Title>Edit Crop Issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={modalData.Title}
              onChange={(e) =>
                setModalData({ ...modalData,
                Title: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>KeyWords</Form.Label>
            <Form.Control
              type="text"
              value={modalData.KeyWords}
              onChange={(e) =>
                setModalData({ ...modalData, KeyWords: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Symptoms</Form.Label>
            <Form.Control
              as="textarea"
              className='h-auto'
              rows={15}
              value={modalData.Symptoms}
              onChange={(e) =>
                setModalData({ ...modalData, Symptoms: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Treatments</Form.Label>
            <Form.Control
              as="textarea"
              className='h-auto'
              rows={15}
              value={modalData.Treatments}
              onChange={(e) =>
                setModalData({ ...modalData, Treatments: e.target.value })
              }
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Causes</Form.Label>
            <Form.Control
              as="textarea"
              className='h-auto'
              rows={15}
              value={modalData.Causes}
              onChange={(e) =>
                setModalData({ ...modalData, Causes: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Prevention</Form.Label>
            <Form.Control
              as="textarea"
              className='h-auto'
              rows={15}
              value={modalData.Prevention}
              onChange={(e) =>
                setModalData({ ...modalData, Prevention: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="fileUpload">
              <Form.Label>Replace File:</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
        </Modal.Body>
        <div className="file-wrap d-flex justify-content-center align-items-center ">
    
          <img src={urls} className='w-75' alt="tenderImage"/>
 
      </div>
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

export default CropIssues;
