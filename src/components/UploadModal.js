import React, { useRef, useState } from 'react';
import '../style/style.css';

import { db, storage } from '../firebase-config';
import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ref, getDownloadURL, uploadString } from 'firebase/storage';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const UploadModal = (props) => {
    const filePickerRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const captionRef = useRef(null);

    const [loading, setLoading] = useState(false);

    // const [progress, setProgress] = useState(0);

    const addImgToPost = (e) => {
        const reader = new FileReader();
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0]);
        };
        
        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result);
        };
    }

    const uploadPost = async () => {
        if(loading) return; // prevent user from pressing upload button twice

        setLoading(true);

        // 1) create a post and add to firestore 'posts' collection
        // 2) get the id for the newly created post from firestore
        // 3) upload the image to firebase storage with post id
        // 4) get a download URL from firebase storage, and update the firebase post with imageURL 
         
        // 1)
        const docRef = await addDoc(collection(db, 'posts'), {
            username: getAuth().currentUser.email,
            caption: captionRef.current.value,
            timestamp: serverTimestamp(),
            likeCount: [],
            comments: [],
        });
        // console.log('new doc added to firebase with ID:', docRef.id);

        //2), 3)
        const imageRef = ref(storage, `posts/${docRef.id}/image`);

        // 4)
        // we are reading in the image, and showing on the screen, so select data type: data_url
        await uploadString(imageRef, selectedFile, 'data_url').then(async snapshot => {
            const downloadURL = await getDownloadURL(imageRef);

            // Progress function
            // const progress = Math.round(
            //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            // );
            // setProgress(progress);

            await updateDoc(doc(db, 'posts', docRef.id), {
                image: downloadURL,
            });
        })

        setSelectedFile(null);
        setLoading(false);

    }

    const closeModalAndUpload = () => {
        uploadPost();
        props.handleClose();
    }

    return(
        <Modal show={props.show} onHide={props.handleClose} centered id="uploadModal">
            <Modal.Header className='d-flex flex-column'>
                
                {selectedFile ? (
                     <img 
                        className="w-100"
                        src={selectedFile} 
                        alt="selected file"
                        onClick={() => {
                            setSelectedFile(null);
                            filePickerRef.current.click();
                        }}/>
                ) : (
                    <div onClick={() => filePickerRef.current.click()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" className="bi bi-camera" viewBox="0 0 16 16">
                            <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"/>
                            <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
                        </svg>
                    </div>
                )}
                {/* <progress className="w-100" value={progress} max="100" /> */}
                <input type="file" ref={filePickerRef} onChange={addImgToPost} hidden/>
            </Modal.Header>
            
            <Modal.Body>
                <input className="w-100" type="text" maxLength="100" ref={captionRef} placeholder="Please enter a caption..."/>    
            </Modal.Body>
            
            <Modal.Footer>
                <Button variant="primary" onClick={closeModalAndUpload} disabled={!selectedFile}>
                    Upload
                </Button>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

    );
};

export default UploadModal;