
import React, {  useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../FirebaseConfig/firebaseConfig';
import {  ref, push } from 'firebase/database';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
const Advisory = () => {
    const [form, setForm] = useState({
      Description: '',
      Id: '',
      LongDescription: '',
      Text: '',
      DateUploaded: '',
    });
  
    const [notification, setNotification] = useState(null);
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };
  
    const generateId = () => {
      const newId = uuidv4();
      setForm((prevForm) => ({ ...prevForm, Id: newId }));
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      form["DateUploaded"]=new Date().toLocaleDateString('en-GB');
      console.log(form)
      // Verify that no field is empty
      for (const field in form) {
        if (!form[field]) {
          alert('Please fill in all fields.');
          return;
        }
      }
      console.log(form)
      // Save the form data to Firebase Realtime Database
      const noticesRef = ref(db, "Advisory");
      push(noticesRef,form).then((res)=>{
        console.log(res)
      })
  
      // Upload the selected file to Firebase Storage
     
  
      // Reset the form fields
      setForm({
        Description: '',
        Id: '',
        LongDescription: '',
        Text: '',
        DateUploaded: '',
      });
  
      // Show notification
      setNotification('Data saved successfully!');
    };
  
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="p-4 col-12" style={{ backgroundColor: 'rgba(211, 211, 211, 10)'}}>
          <Card.Title as="h1" className="text-center">
            Add Advisory
          </Card.Title>
          {notification && (
            <Alert variant="success" onClose={() => setNotification(null)} dismissible>
              {notification}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            {/* Rest of the form code */}
            <Form.Group controlId="Text">
              <Form.Label>Title:</Form.Label>
              <Form.Control
                type="text"
                name="Text"
                value={form.Text}
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

            
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px'}}>
            <Button type="submit" className='mt-3'>Submit</Button>
            <Link to="/AdvisoryList">
          <Button className='mt-3' variant="primary">Close</Button>
        </Link>
        </div>
          </Form>
        </Card>
      </Container>
    );
  };

  export default Advisory