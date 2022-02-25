import { dbService } from "myFirebase";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { React, useState, useEffect } from "react";

const Home = () => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const getNweets = async () => {
        const q = query(collection(dbService, "nweets"))
        const querySnapShot = await getDocs(q);
        querySnapShot.forEach(document => {
            const nweetObject = {
                ...document.data(),
                id: document.id
            }
            // 배열의 첫번째 요소는 가장 최근 document이고
            // 그 뒤로 이전 document를 이어붙인 배열을 리턴
            setNweets(prev => [nweetObject, ...prev]);
        });
    }
    console.log(nweets);
    useEffect(() => {
        getNweets();
    }, [])
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const docRef = await addDoc(
                collection(
                    dbService, "nweets"), {
                    nweet,
                    createAt: Date.now(),
            });
            setNweet("");
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };
    const onChange = (event) => {
        const { target:{value} } = event;
        setNweet(value);
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
                <input type="submit" value="Nweet" />
            </form>
            <div>
                {nweets.map(nweet => (
                <div key={nweet.id}>
                    <h4>{nweet.nweet}</h4>
                </div>
                ))}
            </div>
        </div>
    )
}
export default Home;