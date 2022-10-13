import React from 'react'
import uniqid from "uniqid";
import '../style/style.css';

import { db, storage } from '../firebase-config';
import { doc, deleteDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

import likeBtn from '../assets/likeBtn.png';
import deleteBtn from '../assets/deleteBtn.png';
import trashBtn from '../assets/trash-can.png';
import sendBtn from '../assets/send.png';


const Post = (post) => {
    
    // Function - Delete Post
    const deletePost = async () => {
        // Firebase
        await deleteDoc(doc(db, 'posts', post.postID));
        
        // Storage
        // Create a reference to the file to delete
        let address = 'posts/' + post.postID + '/image';
        let imageRef = ref(storage, address);
        // Delete the file
        deleteObject(imageRef).then(() => {
            // File deleted successfully
        }).catch((error) => {
            console.log(error);
        });
    }

    const DeleteButton = () => {
        return( 
            <button className='align-self-center border-0' onClick={deletePost} >
                <img src={trashBtn} alt="delete" style={{height: "30px", backgroundColor:"white"}}/>
            </button>
        )
    }

    const likePost = async () => {
        
        // read doc: see if current user liked the post already
        const docRef = doc(db, 'posts', post.postID);
        const docSnap = await getDoc(docRef);
        let likeArray = docSnap.data().likeCount;

            if (likeArray.includes(post.currUserEmail)){
                // user already liked the post
                // set doc: remove the current user name from array
                await updateDoc(docRef, {
                    likeCount: arrayRemove(post.currUserEmail)
                });
            }else{
                // user have not liked the post
                // set doc: add current user name to array
                await updateDoc(docRef, {
                    likeCount: arrayUnion(post.currUserEmail)
                });
            }            
    }

    const LikeButton = () => {
        return(
            <button className='align-self-center border-0' onClick={likePost}>
                <img src={likeBtn} alt="Like" style={{height: "40px", backgroundColor:"white"}}/>
            </button>
        )
    }

    const addComments = async () => {
        const commentData = {
            userEmail: post.currUserEmail,
            comment: document.getElementById(post.postID).value,
            username: post.currUserEmail.substring(0, post.currUserEmail.indexOf('@')),
            id: uniqid(),
        }

        const docRef = doc(db, 'posts', post.postID);
        await updateDoc(docRef, {
            comments: arrayUnion({
                username: commentData.username,
                userEmail: commentData.userEmail,
                comment: commentData.comment,
                id: commentData.id,
            })
        });

        document.getElementById(post.postID).value = '';
    }

    const CommentsInput = () => {
        return(
            <div className="d-flex justify-content-between align-items-center gap-2">
                <input id={post.postID} type="text" maxLength="30" placeholder="Add a comment..." className="inputField"/>
                <img src={sendBtn} alt="upload comment" onClick={addComments} style={{height: "20px", backgroundColor:"white", alignSelf:"center"}}/>
            </div>
        )
    }

    const deleteComment = async (index) => {
        const commentData = {
            userEmail: post.currUserEmail,
            comment: post.comments[index].comment,
            username: post.currUserEmail.substring(0, post.currUserEmail.indexOf('@')),
            id: post.comments[index].id,
        }

        const docRef = doc(db, 'posts', post.postID);
        await updateDoc(docRef, {
            comments: arrayRemove({
                username: commentData.username,
                userEmail: commentData.userEmail,
                comment: commentData.comment,
                id: commentData.id,
            })
        });

    }

    const Comments = () => {
        return(
            <div>
                {
                    post.comments.map((comment, index) => {
                        if (comment.userEmail === post.currUserEmail){
                            return(
                                <div key={index} className="d-flex justify-content-between gap-1">
                                    <div className="d-flex" id="comment">
                                        <div className="fw-bolder" id="commentUser">{comment.username}</div>
                                        <div className="ms-3">{comment.comment}</div>    
                                    </div>    
                                    <img onClick={() => deleteComment(index)} src={deleteBtn} alt="delete comment" style={{height: "20px", backgroundColor:"white"}}/>
                                </div>
                            )
                        }
                        return(
                            <div key={index} className="d-flex justify-content-between gap-1">
                                <div className="d-flex" id="comment">
                                    <div className="fw-bolder" id="commentUser">{comment.username}</div>
                                    <div className="ms-3">{comment.comment}</div>    
                                </div>    
                            </div>
                        )
                    })
                }
            </div>
            
        )
    }

    return(
        <div className="card" key={uniqid()} id="card">
            <div className="bg-secondary text-white d-flex justify-content-between" style={{height: "40px"}}>
                <div className='ps-3 align-self-center fw-bolder'>@{post.username}</div>
                <div className="pe-3 align-self-center fw-bolder">{post.timestamp}</div>
            </div>
            
            <img src={post.imgURL} className="card-img-top" alt="post"/>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center" id="firstSection">
                    <div className="bg-light text-wrap p-2 rounded align-self-center" id="postCaption">{post.caption}</div>
                    <div className="d-flex justify-content-center align-items-center gap-3" id="btns">
                        <div style={{fontWeight:"600"}} className='p-1 border border-dark text-center'>{post.likeCount} likes</div>
                        <LikeButton/>
                        {post.isCurrentUserPoster ? <DeleteButton/> : null}
                    </div>
                </div>
                <Comments/>
                <CommentsInput/>
                
            </div>
        </div>
    )
}

export default Post;