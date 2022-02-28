import { dbService } from "myFirebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { React, useState, useEffect } from "react";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => {
    const [nweets, setNweets] = useState([]);
    useEffect(() => {
        // nweets 에서 작성시간 순으로 정렬하여 호출하는 쿼리
        const q = query(
            collection(dbService, "nweets"),
            orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
            const nweetArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        setNweets(nweetArr);
        });
    }, [])
        return (
        <div className="container">
            <NweetFactory userObj={userObj}/>
            <div style={{ marginTop: 30 }}>
                {nweets.map(nweet => (
                 <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    )
}
export default Home;