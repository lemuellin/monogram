import React from 'react'
import uniqid from "uniqid";

import { db, storage } from '../firebase-config';
import { doc, deleteDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";


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
            <button className='align-self-center border-0' onClick={deletePost} style={{height: "3vw"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash3-fill align-self-center " viewBox="0 0 20 20">
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
                </svg>
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
            <button className='align-self-center border-0' onClick={likePost} style={{height: "3vw"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-heart" viewBox="0 0 20 20">
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                </svg>
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
            <div className="d-flex justify-content-between">
                <input id={post.postID} type="text" maxLength="100" placeholder="Add a comment..." style={{width: "40vw"}}/>
                <button onClick={addComments} type="button" style={{width: "7vw"}}>Submit</button>
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
                                <div key={index} className="d-flex justify-content-between">
                                    <div className="d-flex" style={{width: "40vw"}}>
                                        <div className="fw-bolder">{comment.username}</div>
                                        <div className="ms-3">{comment.comment}</div>    
                                    </div>    
                                    <button style={{width: "7vw"}} onClick={() => deleteComment(index)}>Delete</button>
                                </div>
                            )
                        }
                        return(
                            <div key={index} className="d-flex justify-content-between">
                                <div className="d-flex" style={{width: "40vw"}}>
                                    <div className="fw-bolder">{comment.username}</div>
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
        <div className="card" style={{width: "50vw"}} key={uniqid()}>
            <div className="bg-secondary text-white d-flex justify-content-between" style={{height: "40px"}}>
                <div className='ps-3 align-self-center fw-bolder'>@{post.username}</div>
                <div className="pe-3 align-self-center fw-bolder">{post.timestamp}</div>
            </div>
            
            <img src={post.imgURL} className="card-img-top" alt="post"/>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="bg-light text-wrap p-2 rounded align-self-center" style={{width: "40vw"}}>{post.caption}</div>
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <div>
                            <LikeButton/>
                            {post.isCurrentUserPoster ? <DeleteButton/> : null}
                        </div>
                        <div>{post.likeCount} likes</div>
                    </div>
                </div>
                <Comments/>
                <CommentsInput/>
                
            </div>
        </div>
    )
}

export default Post;