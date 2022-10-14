import React, { useEffect } from 'react';
import '../style/style.css';

import Signup from '../components/Signup';
import Login from '../components/Login';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import camera from "../assets/camera.jpg";

import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

const LoginPage = () => {

    const nav = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
              const uid = user.uid;
              nav('/');
            } else {
              // User is signed out
            }
          });
    },[]);
  
    return(
        <div className="d-flex flex-column align-items-center justify-content-center" style={{width: "100vw", height: "100vh"}}>
            <h1>MONOGRAM</h1>
            <div className="d-flex align-items-center justify-content-center gap-3">
                <img src={camera} alt="retro camera" id="camera"/>
                <div id="login">
                    <Tabs
                    defaultActiveKey="login"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                    justify
                    >
                        <Tab eventKey="login" title="Log In">
                            <Login/>
                        </Tab>
                        <Tab eventKey="signup" title="Sign Up">
                            <Signup/>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;