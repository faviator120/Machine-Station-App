
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
import { Link } from 'react-router-dom';
const AddCropIssue = () => {
    const [form, setForm] = useState({
      Catagory: '',
      Id: '',
      KeyWords: '',
      Title: '',
      ImageFileName: '', 
      Symptoms: '',
      Treatments: '',
      Causes: '',
      Prevention:''
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
  
    const generateIdByFocus = () => {
        const newId = uuidv4();
        if (form.Id === '')
          setForm((prevForm) => ({ ...prevForm, Id: newId }));
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
      const noticesRef = ref(db, "CropIssues");
      form.ImageFileName = form.Id
      form.DateUploaded =new Date().toLocaleString()
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
        Catagory: '',
        Id: '',
        KeyWords: '',
        Title: '',
        ImageFileName: '', 
        Symptoms: '',
        Treatments: '',
        Causes: '',
        Prevention:''
      });
  
      // Show notification
      setNotification('Data saved successfully!');
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
      <Container className="d-flex justify-content-center align-items-center">
        <Card className="p-4 col-12" style={{ backgroundColor: 'rgba(211, 211, 211, 10)'}}>
          <Card.Title as="h1" className="text-center">
            Add Crop Issue
          </Card.Title>
          {notification && (
            <Alert variant="success" onClose={() => setNotification(null)} dismissible>
              {notification}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            {/* Rest of the form code */}
            
            <Form.Group controlId="Id">
              <Form.Label>Id:</Form.Label>
              <Form.Control
                type="text"
                name="Id"
                value={form.Id}
                onChange={handleInputChange}
                readOnly
                tabIndex="-1"
                onFocus={generateIdByFocus}
              />
              <Button className="mt-2" variant="secondary" onClick={generateId}>
                Generate
              </Button>
            </Form.Group>
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
            <Form.Group controlId="Catagory">
              <Form.Label>Catagory:</Form.Label>
              <Form.Control
                type="text"
                name="Catagory"
                value={form.Catagory}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="KeyWords">
              <Form.Label>KeyWords:</Form.Label>
              <Form.Control
                type="text"
                name="KeyWords"
                value={form.KeyWords}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="Symptoms">
              <Form.Label>Symptoms:</Form.Label>
              <Form.Control
              as="textarea"
              rows={15} // Adjust the number of rows as needed
              name="Symptoms"
              value={form.Symptoms}
              onChange={handleInputChange}
            />
            </Form.Group>
            <Form.Group controlId="Causes">
              <Form.Label>Causes:</Form.Label>
              <Form.Control
              as="textarea"
              rows={15} // Adjust the number of rows as needed
              name="Causes"
              value={form.Causes}
              onChange={handleInputChange}
            />
            
            </Form.Group>
            <Form.Group controlId="Prevention">
              <Form.Label>Prevention:</Form.Label>
              <Form.Control
              as="textarea"
              rows={15} // Adjust the number of rows as needed
              name="Prevention"
              value={form.Prevention}
              onChange={handleInputChange}
            />
            </Form.Group>
            <Form.Group controlId="Treatments">
              <Form.Label>Treatments:</Form.Label>
              <Form.Control
              as="textarea"
              rows={15} // Adjust the number of rows as needed
              name="Treatments"
              value={form.Treatments}
              onChange={handleInputChange}
            />
            </Form.Group>

   
            <Form.Group controlId="fileUpload">
              <Form.Label>File Upload:</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button type="submit"  className='m-2'>Submit</Button>
            <Link to="/CropIssues" >
          <Button variant="primary" className='mt-2 m-2'>Back</Button>
        </Link>
          </Form>
        </Card>
      </Container>
    );
  };

  export default AddCropIssue