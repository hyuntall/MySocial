import { dbService, storageService } from "myFirebase";
import { addDoc, collection, getDocs, query, onSnapshot, orderBy } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage"
import { React, useState, useEffect, useRef } from "react";
import Nweet from "components/Nweet";
import {v4} from "uuid";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    const fileInput = useRef();
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
    const onSubmit = async (event) => {
        event.preventDefault();
        
        try {
            let attachmentURL = "";
            if(attachment !== ""){
                // 파일 경로 참조 생성
                const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);//v4: 랜덤숫자
                // storage 참조 경로로 파일 업로드
                const uploadFile = await uploadString(attachmentRef, attachment, "data_url");
                // storage에 있는 파일 URL로 다운
                attachmentURL = await getDownloadURL(uploadFile.ref)
                console.log(attachmentURL);
            }
            const docRef = await addDoc(
                collection(
                    dbService, "nweets"), {
                    text: nweet,
                    createdAt: Date.now(),
                    creatorId: userObj.uid,
                    attachmentURL
            });
            setNweet("");
            onClearAttachmentClick();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };
    const onChange = (event) => {
        const { target:{value} } = event;
        setNweet(value);
    }
    const onFileChange = (event) => {
        // 이미지 입력 시 url을 읽는 함수
        const {target:{files}} = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishEvent) => {
            const {currentTarget: { result }} = finishEvent
            setAttachment(result)
        }
        reader.readAsDataURL(theFile);
    }
    const onClearAttachmentClick = () => {
        setAttachment("")
        fileInput.current.value = "";
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
                <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput}/>
                <input type="submit" value="Nweet" />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachmentClick}>Clear</button>
                    </div>
                )}
            </form>
                    
            <div>
                {nweets.map(nweet => (
                 <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    )
}
export default Home;