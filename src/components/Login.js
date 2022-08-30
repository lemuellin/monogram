import React, { useState } from 'react';
import { Form, Button, Card } from "react-bootstrap";

import { auth } from '../firebase-config';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const nav = useNavigate();

    const loginUser = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            nav('/home');
        })
        .catch((error) => {
            alert(error.code);
        })
    }

    // Google Log In
    const provider = new GoogleAuthProvider();
    const googleLogIn = (e) => {
        e.preventDefault();
        signInWithPopup(auth, provider)
        .then((result) => {
            nav('/home');
          }).catch((error) => {
            alert(error.code);
          });
    }

    const testAccount = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, 'testAccount@gmail.com', '123456')
        .then((userCredential) => {
            nav('/home');
        })
        .catch((error) => {
            alert(error.code);
        })
        nav('/home');
    }

    return (
        <div>
            <Card>
                <Card.Body>
                    <Form className="d-flex flex-column gap-2">
                        <Form.Group id="email">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" onChange={(e) => setEmail(e.target.value)} required></Form.Control>
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} required></Form.Control>
                        </Form.Group>
                        <Button className="w-100" onClick={loginUser} type="submit" disabled={!email && !password}>Log In</Button>
                        <Button className="w-100" variant="success" type="submit" onClick={googleLogIn}>Log In with Google</Button>
                        <Button className="w-100" variant="info" type="button" onClick={testAccount}>Just Visiting</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Login;