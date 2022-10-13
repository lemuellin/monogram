import React, { useState } from 'react';
import '../style/style.css';

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
            <div className='row' key={uniqid()}>
                <div className="d-flex justify-content-center col-sm">
                    <img src={postList[3*i-3].imgURL} id="profileItem" style={{objectFit: "contain", objectPosition: "center"}}/>
                </div>
                <div className="d-flex justify-content-center col-sm">
                    <img src={postList[3*i-2].imgURL} id="profileItem" style={{objectFit: "contain", objectPosition: "center"}}/>
                </div>
                <div className="d-flex justify-content-center col-sm">
                    <img src={postList[3*i-1].imgURL} id="profileItem" style={{objectFit: "contain", objectPosition: "center"}}/>
                </div>
            </div>
        );
    }

    if(remainderNum == 1){
        remainderRows.push(
            <div key={uniqid()} className="d-flex justify-content-center col-sm">
                <img src={postList[postList.length - 1].imgURL} id="profileItem" style={{objectFit: "contain", objectPosition: "center"}}/>
            </div>
        );
        remainderRows.push(
            <div key={uniqid()} className="d-flex justify-content-center col-sm">
                <div id="profileItem" style={{objectFit: "contain", objectPosition: "center"}}></div>
            </div>
        );
        remainderRows.push(
            <div key={uniqid()} className="d-flex justify-content-center col-sm">
                <div id="profileItem" style={{objectFit: "contain", objectPosition: "center"}}></div>
            </div>
        );

    }else if(remainderNum == 2){
        for (let i = 2; i >= 1; i--){
            remainderRows.push(
                <div key={uniqid()} className="d-flex justify-content-center col-sm">
                    <img id="profileItem" src={postList[postList.length - i].imgURL} style={{objectFit: "contain", objectPosition: "center"}}/>
                </div>
            );
        }
        remainderRows.push(
            <div key={uniqid()} className="d-flex justify-content-center col-sm">
                <div id="profileItem" style={{objectFit: "contain", objectPosition: "center"}}></div>
            </div>
        );
    }

    return(
        <div>
            <h1 className="text-center">@{currUser}</h1>
            <Container className="border">
                {fullRows}
                <div className='row'>
                    {remainderRows}
                </div>
            </Container>
        </div>
    )
}

export default Profile;