import React, { useState, useRef } from "react";
import { storageService, dbService } from "myFirebase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage"
import {v4} from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import 'post.css'
const PostFactory = ({ userObj }) => {
    const [post, setPost] = useState("");
    const [attachment, setAttachment] = useState("");
    const fileInput = useRef();
    const onSubmit = async (event) => {
        // 작성한 게시글 업로드하는 함수
        if (post === "") {
            // 작성한 글이 없으면 return
            return;
        }
        event.preventDefault();
        
        try {
            let attachmentURL = "";
            if(attachment !== ""){
                // 이미지 첨부 했을 경우
                // 파일 경로 참조 생성
                const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);//v4: 랜덤숫자
                // storage 참조 경로로 파일 업로드
                const uploadFile = await uploadString(attachmentRef, attachment, "data_url");
                // storage에 있는 파일 URL로 다운
                attachmentURL = await getDownloadURL(uploadFile.ref)
                console.log(attachmentURL);
            }
            const docRef = await addDoc(
                // 작성한 게시글 db에 업로드
                collection(
                    dbService, "posts"), {
                    text: post,
                    createdAt: Date.now(),
                    creatorId: userObj.uid,
                    creatorName: userObj.displayName,
                    userProfile: userObj.photoURL,
                    attachmentURL
            });
            setPost("");
            onClearAttachmentClick();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };
    const onChange = (event) => {
        const { target:{value} } = event;
        setPost(value);
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
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input className="FactoryInput_input"
                value={post} onChange={onChange} 
                type="text" placeholder="What's on your mind?" maxLength={120}/>
                <input className="factoryInput__arrow"
                type="submit" value="post" />
            </div>

            <label htmlFor="attach-file" className="factoryInput_label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input id="attach-file" style={{opacity: 0}} // 이미지파일 첨부 버튼
            type="file" accept="image/*" onChange={onFileChange} ref={fileInput}/>
            
            {attachment && ( // 첨부한 이미지가 있을 경우 이미지 표시
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
export default PostFactory