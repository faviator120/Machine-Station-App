import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { get,ref} from 'firebase/database';
import { db } from '../FirebaseConfig/firebaseConfig';

const Home = () => {
    const [notice, setNoticeCount] = useState([]);
    const [advisory, setAdvisoryCount] = useState([]);
    const [tenders, setTenderCount] = useState([]);
    const [newsFeed, setNewsCount] = useState([]);
    const [problems, setProblemCount] = useState([]);


  useEffect(() => {
    // let dbRef = ref(db, "/Notices");
    // get(dbRef).then((snapshot) => {
    //   setNoticeCount(Object.keys(snapshot.val()).length);
    // });
    //  dbRef = ref(db, "/NewsFeed");
    // get(dbRef).then((snapshot) => {
    //   setNewsCount(Object.keys(snapshot.val()).length);
    // });
    // dbRef = ref(db, "/Advisory");
    // get(dbRef).then((snapshot) => {
    //   setAdvisoryCount(Object.keys(snapshot.val()).length);
    // });
    // dbRef = ref(db, "/Tenders");
    // get(dbRef).then((snapshot) => {
    //   setTenderCount(Object.keys(snapshot.val()).length);
    // });
    let dbRef = ref(db, "/CropIssues");
    get(dbRef).then((snapshot) => {
      setProblemCount(Object.keys(snapshot.val()).length);
    });
  }, []);

  return (
    <div className='align-content-center'>
    {/* <Card key={"notice"}>
      <Card.Body>
        <Card.Title>Notices</Card.Title>
        <Card.Text>Number of Entries: {notice}</Card.Text>
        <Button href='/NoticeList' variant="primary">Edit</Button>
      </Card.Body>
    </Card>
        <Card key={"Advisory"}>
          <Card.Body>
            <Card.Title>Advisory</Card.Title>
            <Card.Text>Number of Entries: {advisory}</Card.Text>
            <Button href='/AdvisoryList' variant="primary">Edit</Button>
          </Card.Body>
        </Card>
        <Card key={"News"}>
          <Card.Body>
            <Card.Title>NewsFeed</Card.Title>
            <Card.Text>Number of Entries: {newsFeed}</Card.Text>
            <Button href='NewsFeedList' variant="primary">Edit</Button>
          </Card.Body>
        </Card>
        <Card key={"Tenders"}>
          <Card.Body>
            <Card.Title>Tenders</Card.Title>
            <Card.Text>Number of Entries: {tenders}</Card.Text>
            <Button href='TenderList' variant="primary">Edit</Button>
          </Card.Body>
        </Card> */}
        <Card key={"CropIssues"}>
          <Card.Body>
            <Card.Title>Crop Issues</Card.Title>
            <Card.Text>Number of Entries: {problems}</Card.Text>
            <Button href='CropIssues' variant="primary">Edit</Button>
          </Card.Body>
        </Card>
    </div>
  );
};

export default Home;
