import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../FirebaseConfig/firebaseConfig";
import { NavLink, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError,setLoginError] = useState(null)

  const space = { marginTop: "20px" };

  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setLoginError(null)
        navigate("/Home");
        console.log("user", user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoginError("Worng username or password.")
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <Container className=" w-100 dflex justify-content-center align-items-center "
    style={{
        backgroundColor: "#11111166",
        borderRadius: "10px",
        minWidth:"100vw",
        position:'absolute',
        top: "35vh",
        paddingLeft: '10vw',
        paddingRight: '10vw',
        paddingTop: 20,
        paddingBottom: 20,
        
      }}>
        <div  className=" w-100 text-white justify-content-center align-items-center  "
          style={{
            backgroundColor: "#11111166",
            borderRadius: "10px",
            padding: 50,
            
          }}
        >
          <Row style={space}>
            <Col xs={5} className="text-left">
              <label htmlFor="email-address">Email address</label>
            </Col>
            <Col xs={6}>
              {/* <input
                id="email-address"
                name="email"
                type="email"
                required
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              /> */}
              <input
                type="email"
                className="form-control"
                id="email-address"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Col>
          </Row>

          <Row style={space}>
            <Col xs={5} className="text-left">
              <label htmlFor="password">Password</label>
            </Col>
            <Col xs={6}>
              {/* <input
              className="w-100"
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              /> */}
              <input
                type="password"
                className="form-control"
                id="password"
                aria-describedby="emailHelp"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Col>
            <p className="text-danger">{loginError}</p>
          </Row>
          <div className="text-center w-100" style={space}>
            <button
              type="button text-center"
              className="btn btn-primary"
              onClick={onLogin}
            >
              Login
            </button>
          </div>

     
        </div>
        <div
          className="text-center justify-content-bottom align-items-bottom"
        >
          <p>Developed by BB&GG Group ®</p>
          <p>Network Partners: Premier Sales Agency J&K</p>
        </div>
    </Container>
  );
};

export default Login;
