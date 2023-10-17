import React, { useState,useEffect } from 'react';
import Notices from './Components/Notices';
import Advisory from './Components/Advisory';
import Tenders from './Components/Tenders';
import NoticeList from './Components/NoticeList';
import TenderList from './Components/TenderList';
import AdvisoryList from './Components/AdvisoryList';
import CropIssues from './Components/ProblemList';
import AddCropIssue from './Components/AddCropIssue';
import ProblemList from './Components/Problems';
import AddNews from './Components/AddNewsFeed';
import NewsFeedList from './Components/NewsFeedList';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from 'react-bootstrap';
import Login from './Components/Login';
import { BrowserRouter as Router, Route, Routes, redirect } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from './FirebaseConfig/firebaseConfig';
import { signOut } from 'firebase/auth';
import Home from './Components/home';





const App = () => {
  
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    document.title = "HHAL-Admin"
 }, []);

  function useLoginStatus(){

    if(user){
      return true
    }
    console.log("User not loggid in")
      return false
    }
    
    const RequireAuth=  ({ children }) => {
      const userIsLogged =  useLoginStatus(); // Your hook to get login status
    
      if (!userIsLogged) {
        if(loading)
          return <div className='h-100 align-middle d-flex flex-column justify-content-center'>
          <h1 className='text-center align-center'>Welcome to</h1>
          <img
              src="logo.jpg" // Replace with the path to your logo image
              className="d-inline-block align-top"
              alt="Company Logo"
            />
            <div className='align-bottom'>
          <h3 className='text-center align-center'>One stop place for all your farming needs.</h3>
          <p className='text-center align-center'>Brought to you by BB&GG group</p>
          <p className='text-center align-center'>Network Partners: Premier Sales Agency J&K</p>
          </div>
          </div>
         return <Login />;
      }
      return children;
    };
    const handleLogout = ()=>{
      
      console.log("logging out")
      signOut(auth).then(() => {
            console.log("Signed out successfully")
            redirect('/')
        }).catch((error) => {
        console.log("An error happened.",error)
        });
    }
    
  return (
    <Router>
   <Navbar bg="secondary" className='mb-2' expand="lg">
      <Navbar.Brand  href='/Home'>
      <img
              alt=""
              src="logo.jpg"
              height="30"
              className="d-inline-block align-top"
            />{' '}
           <span className='text-white font-weight-bold'>HHAL Admin </span> </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      {user && <Navbar.Collapse id="navbar-nav">
        <Nav className="ml-auto">
          {/* <Nav.Link href="/NoticeList"><b>Notices/Trainings</b></Nav.Link>
          <Nav.Link href="/TenderList"><b>Tenders</b></Nav.Link>
          <Nav.Link href="/AdvisoryList"><b>Advisory</b></Nav.Link> */}
          <Nav.Link href="/CropIssues"><b>Crop Issues</b></Nav.Link>
          {/* <Nav.Link href="/ProblemList"><b>Problems</b></Nav.Link> */}
          {/* <Nav.Link href="/NewsFeedList"><b>NewsFeed</b></Nav.Link> */}
          <Nav.Link onClick={handleLogout}><b>Logout</b></Nav.Link>
        </Nav>
      </Navbar.Collapse>}
    </Navbar>

    <Routes >
      {/* <Route exact path="/AddNotice" element={<RequireAuth><Notices/></RequireAuth>} /> */}
      <Route path="/" element={<RequireAuth><Home/></RequireAuth>}/>
      <Route path="/Home" element={<RequireAuth><Home/></RequireAuth>}/>
      {/* <Route path="/NoticeList" element={<RequireAuth><NoticeList/></RequireAuth>}/> */}
      {/* <Route path="/Advisory" element={<RequireAuth><Advisory/></RequireAuth>} /> */}
      {/* <Route path="/AdvisoryList" element={<RequireAuth><AdvisoryList/></RequireAuth>} /> */}
      {/* <Route path="/Tenders" element={<RequireAuth><Tenders/></RequireAuth>} />
      <Route path="/TenderList" element={<RequireAuth><TenderList/></RequireAuth>} /> */}
      <Route path="/CropIssues" element={<RequireAuth><CropIssues/></RequireAuth>}/>
      <Route path="/AddCropIssue" element={<RequireAuth><AddCropIssue/></RequireAuth>}/>
      {/* <Route path="/NewsFeedList" element={<RequireAuth><NewsFeedList/></RequireAuth>} />
      <Route path="/AddNews" element={<RequireAuth><AddNews/></RequireAuth>} /> */}
      <Route path="/Login" element={<Login/>} />
    </Routes>
  </Router>
  );
};

export default App;
