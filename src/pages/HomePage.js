import React, { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import Post from "../components/Post";
import Profile from '../components/Profile';
import WeatherWidget from '../components/WeatherWidget';

import { db } from "../firebase-config";
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

import { auth } from '../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

import { useNavigate } from 'react-router-dom';

const HomePage = () => {

    const [posts, setPosts] = useState([]);
    const [profileClicked, setProfileClicked] = useState(false);

    const nav = useNavigate();
    let currUserEmail;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        currUserEmail = user.email;
      }else{
        nav('/login');
      }
    });

    useEffect(() => {
      const postsRef = collection(db, 'posts');
      const postsQuery = query(postsRef, orderBy('timestamp', 'desc'));
      onSnapshot(postsQuery, (snapshot) => {
        const postsList = [];
        snapshot.docs.forEach((post) => {
          let userEmail = post.data().username;
          let username = userEmail.substring(0, userEmail.indexOf('@'));
          let caption = post.data().caption;
          let imgURL = post.data().image;
          
          let postID = post._document.key.path.segments[6]; 

          let timestamp = new Date().toString();
          try {
            timestamp = new Date(post.data().timestamp.seconds * 1000 + post.data().timestamp.nanoseconds/1000000).toLocaleDateString();
          } catch (error){
            
          }

          let isCurrentUserPoster = false;        
          if (userEmail === currUserEmail){
            isCurrentUserPoster = true;
          }
          
          let likeCount = post.data().likeCount.length;

          let commentArray = post.data().comments;

          postsList.push({
            username: username, 
            caption: caption, 
            timestamp: timestamp, 
            imgURL: imgURL, 
            isCurrentUserPoster: isCurrentUserPoster, 
            postID: postID,
            likeCount: likeCount,
            userEmail: userEmail,
            currUserEmail: currUserEmail,
            comments: commentArray,
          });
        })
        setPosts(postsList);
      });
      
    },[]);

    return(
        <div>
            <NavBar clickProfile={() => setProfileClicked(true)} clickHome={() => setProfileClicked(false)}/>
            
            { profileClicked ? 
              <Profile data={posts}/> : 
              <div>
                <WeatherWidget/>
                <div id="timeline" className="d-flex flex-column align-items-center justify-content-center mt-4 gap-4">
                  {posts.map((post)=>Post(post))}
                </div>
              </div>  
            }
        </div>
    );
};

export default HomePage;