import React, { useState } from 'react'
import { Form, Button, Card } from "react-bootstrap"

import { auth } from '../firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";

import { useNavigate } from 'react-router-dom';


const Signup = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const nav = useNavigate();

    const signUpUser = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => 
            // console.log(userCredential.user),
            nav('/')
        )
        .catch((error) => {
            // console.log(error.code);
            // console.log(error.message);
            alert(error.code);
        })
    };

    const validatePwd = (e) => {
        e.preventDefault();
        if (password !== passwordConfirm){
            document.getElementById('pwdConfirm').style.backgroundColor = "#ff758f";
        }else{
            document.getElementById('pwdConfirm').style.backgroundColor = "white";
        }
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
                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" onChange={(e) => setPasswordConfirm(e.target.value)} onKeyUp={(e) => validatePwd(e)} id='pwdConfirm' required></Form.Control>
                        </Form.Group>
                        <Button className="w-100" type="submit" onClick={signUpUser} disabled={!email || !password || (password !== passwordConfirm)}>Sign Up</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Signup;