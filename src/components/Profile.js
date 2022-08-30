import React, { useState } from 'react';
import { auth } from '../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import uniqid from "uniqid";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Profile = (props) => {
    const [ currUser, setCurrUser ] = useState('');

    onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrUser(user.email.substring(0, user.email.indexOf('@')));
        }
    });

    let postList = [];
    let fullRows = [];
    let remainderRows = [];
    let rowNum;
    let remainderNum;

    props.data.map((post) => {
        if (post.isCurrentUserPoster){
            postList.push(post);
        }
        rowNum = Math.floor(postList.length/3);
        remainderNum = postList.length%3;
    });

    // console.log(postList[0].imgUrl);

    for(let i = 1; i <= rowNum; i++){
        fullRows.push(
            <Row key={uniqid()}>
                <Col className="d-flex justify-content-center">
                    <img src={postList[3*i-3].imgURL} style={{width: "20vw", height: "20vw", objectFit: "contain", objectPosition: "center"}}/>
                </Col>
                <Col className="d-flex justify-content-center">
                    <img src={postList[3*i-2].imgURL} style={{width: "20vw", height: "20vw", objectFit: "contain", objectPosition: "center"}}/>
                </Col>
                <Col className="d-flex justify-content-center">
                    <img src={postList[3*i-1].imgURL} style={{width: "20vw", height: "20vw", objectFit: "contain", objectPosition: "center"}}/>
                </Col>
            </Row>
        );
    }

    if(remainderNum == 1){
        remainderRows.push(
            <Col key={uniqid()} className="d-flex justify-content-center">
                <img src={postList[postList.length - 1].imgURL} style={{width: "20vw", height: "20vw", objectFit: "contain", objectPosition: "center"}}/>
            </Col>
        );
        remainderRows.push(
            <Col key={uniqid()} className="d-flex justify-content-center">
                <div style={{width: "20vw", height: "20vw", objectFit: "contain", objectPosition: "center"}}></div>
            </Col>
        );
        remainderRows.push(
            <Col key={uniqid()} className="d-flex justify-content-center">
                <div style={{width: "20vw", height: "20vw", objectFit: "contain", objectPosition: "center"}}></div>
            </Col>
        );

    }else if(remainderNum == 2){
        for (let i = 2; i >= 1; i--){
            remainderRows.push(
                <Col key={uniqid()} className="d-flex justify-content-center">
                    <img src={postList[postList.length - i].imgURL} style={{width: "20vw", height: "20vw", objectFit: "contain", objectPosition: "center"}}/>
                </Col>
            );
        }
        remainderRows.push(
            <Col key={uniqid()} className="d-flex justify-content-center">
                <div style={{width: "20vw", height: "20vw", objectFit: "contain", objectPosition: "center"}}></div>
            </Col>
        );
    }

    return(
        <div>
            <h1 className="text-center">@{currUser}</h1>
            <Container className="border w-75">
                {fullRows}
                <Row>
                    {remainderRows}
                </Row>
            </Container>
        </div>
    )
}

export default Profile;