
import React, {  useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db,storage } from '../FirebaseConfig/firebaseConfig';
import {  ref, push } from 'firebase/database';
import {  ref as storageRef, uploadBytesResumable,getMetadata,deleteObject } from 'firebase/storage';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
const Tenders = () => {
    const [form, setForm] = useState({
      Description: '',
      Id: '',
      LongDescription: '',
      Title: '',
      ImageFileName: '', // Added field for file name
    });
  
    const [selectedFile, setSelectedFile] = useState(null);
    const [notification, setNotification] = useState(null);
    const [updatedItemId, setUpdatedItemId] = useState(null);  
    const [farmPictureURL, setFarmPictureURL] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0); // Progress of the file upload
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
      setForm((prevForm) => ({ ...prevForm, ImageFileName: file ? file.name : '' }));
  
    };
  
    const generateId = () => {
      const newId = uuidv4();
      setForm((prevForm) => ({ ...prevForm, Id: newId }));
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      // Verify that no field is empty
      for (const field in form) {
        if (!form[field]) {
          alert('Please fill in all fields.');
          console.log(form)
          return;
        }
      }
      console.log(form)
      // Save the form data to Firebase Realtime Database
      const noticesRef = ref(db, "Tenders");
      form.ImageFileName = form.Id
      push(noticesRef,form).then((res)=>{
        console.log(res)
      })
  
      // Upload the selected file to Firebase Storage
      if (selectedFile) {
       uploadImageToFirebase(form.Id)
      //  set(fileNameRef, selectedFile.name);
      }
  
      // Reset the form fields
      setForm({
        Description: '',
        Id: '',
        LongDescription: '',
        Title: '',
        ImageFileName: '',
      });
  
      // Show notification
      setNotification('Data saved successfully!');
    };

    const uploadImageToFirebase = async (Id) => {
      // Create a reference to the storage folder
  
      
      // Check if a file with the same name already exists
      const fileRef = storageRef(storage, `TenderPhotos/${Id}`);
      const fileExists = await getMetadata(fileRef)
        .then(() => true)
        .catch(() => false);
      
      // If the file exists, delete it
      if (fileExists) {
        await deleteObject(fileRef);
        console.log('Existing file deleted');
      }
      
      // Upload the new file
      const uploadTask = uploadBytesResumable(fileRef, selectedFile);
      
      uploadTask.on('state_changed',
        (snapshot) => {
          // Track the upload progress if needed
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
  
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="p-4 col-12" style={{ backgroundColor: 'rgba(211, 211, 211, 10)'}}>
          <Card.Title as="h1" className="text-center">
            Add Tenders
          </Card.Title>
          {notification && (
            <Alert variant="success" onClose={() => setNotification(null)} dismissible>
              {notification}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            {/* Rest of the form code */}
            <Form.Group controlId="Title">
              <Form.Label>Title:</Form.Label>
              <Form.Control
                type="text"
                name="Title"
                value={form.Title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="Description">
              <Form.Label>Description:</Form.Label>
              <Form.Control
                type="text"
                name="Description"
                value={form.Description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="Id">
              <Form.Label>Id:</Form.Label>
              <Form.Control
                type="text"
                name="Id"
                value={form.Id}
                onChange={handleInputChange}
                readOnly
                tabIndex="-1"
              />
              <Button className="mt-2" variant="secondary" onClick={generateId}>
                Generate
              </Button>
            </Form.Group>
            <Form.Group controlId="LongDescription">
              <Form.Label>Long Description:</Form.Label>
              <Form.Control
              as="textarea"
              rows={15} // Adjust the number of rows as needed
              name="LongDescription"
              value={form.LongDescription}
              onChange={handleInputChange}
            />
            </Form.Group>

   
            <Form.Group controlId="fileUpload">
              <Form.Label>File Upload:</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button type="submit"  className='mt-2'>Submit</Button>
          </Form>
        </Card>
      </Container>
    );
  };

  export default Tenders