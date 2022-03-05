import { dbService } from "myFirebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { React, useState, useEffect } from "react";
import Post from "components/Post";
import PostFactory from "components/PostFactory";
import 'home.css'
const Home = ({ userObj }) => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        // posts 에서 작성시간 순으로 정렬하여 호출하는 쿼리
        const q = query(
            collection(dbService, "posts"),
            orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
            const postArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        setPosts(postArr);
        });
    }, [])
        return (
        <div className="container">
            <PostFactory userObj={userObj}/>
            <div>
                {posts.map(post => (
                 <Post key={post.id} postObj={post} isOwner={post.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    )
}
export default Home;