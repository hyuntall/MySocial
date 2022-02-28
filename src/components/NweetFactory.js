import React, { useState, useRef } from "react";
import { storageService, dbService } from "myFirebase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage"
import {v4} from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const fileInput = useRef();
    const onSubmit = async (event) => {
        if (nweet === "") {
            return;
          }
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
        <form onSubmit={onSubmit}
        className="factoryForm">
            <div className="factoryInput__container">
                <input className="FactoryInput_input"
                value={nweet} onChange={onChange} 
                type="text" placeholder="What's on your mind?" maxLength={120}/>
                <input className="factoryInput__arrow"
                type="submit" value="Nweet" />
                </div>
                <label htmlFor="attach-file" className="factoryInput_label">
                    <span>Add photos</span>
                    <FontAwesomeIcon icon={faPlus} />
                </label>
                <input id="attach-file" style={{opacity: 0}}
                type="file" accept="image/*" onChange={onFileChange} ref={fileInput}/>
                
                
                {attachment && (
                    <div className="factoryForm__attachment">
                        <img src={attachment} style={{backgroundImage:attachment}} />
                        <div className="factoryForm__clear" onClick={onClearAttachmentClick}>
                            <span>Remove</span>
                            <FontAwesomeIcon icon={faTimes} />
                        </div>
                    </div>
                )}
            </form>
    )
}
export default NweetFactory