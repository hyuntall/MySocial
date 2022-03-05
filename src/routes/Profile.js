import { authService, dbService, storageService } from "myFirebase";
import { collection, onSnapshot, query, where, orderBy } from "@firebase/firestore";
import { updateProfile } from "@firebase/auth";
import { getDownloadURL, ref, uploadString } from "firebase/storage"
import {v4} from "uuid";
import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Post from "components/Post";
import 'profile.css'
export default ({ userObj, refreshUser }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [attachment, setAttachment] = useState(userObj.photoURL);
    const fileInput = useRef();
    const [myPosts, setMyPosts] = useState([]);
    const onLogOutClick = () => {
        // 로그아웃 함수
        // 후에 유저 정보 리프레시
        authService.signOut()
        refreshUser();
    };
    const onChange = (event) => {
        const { target: { value } } = event;
        setNewDisplayName(value);
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

    const onSubmit = async (event) => {
        // 프로필 변경 함수
        event.preventDefault();

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
            // 유저 프로필 이미지 업데이트
            await updateProfile(authService.currentUser, {displayName: newDisplayName, photoURL: attachmentURL});
            // 프사 업로드 기능도 만들어보기!
            refreshUser();
        }

        if(userObj.displayName !== newDisplayName){
            await updateProfile(authService.currentUser, {displayName: newDisplayName, photoURL: attachmentURL});
            // 프사 업로드 기능도 만들어보기!
            refreshUser();
        }
    }

    const getMyNweets = async () => {
        // 내가 작성한 게시글만 호출
        const q = query(
            collection(dbService, "posts"),
            where("creatorId", "==", userObj.uid),
            orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
            const postArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        setMyPosts(postArr);
        });
    };
    useEffect(() =>{
        getMyNweets();
    })
    
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <div className="myInfo">
                    <input type="text" 
                    placeholder="Display name"
                    onChange={onChange}
                    autoFocus
                    value={newDisplayName}
                    className="formInput"/>
                    <div className="profileImgDiv">
                            <img className="myProfileImg" src={attachment ? (attachment):(require("img/user.png"))} />
                        <FontAwesomeIcon className="plusIcon" icon={faPlus} size="2x"/>
                        <input id="attach-file" style={{opacity: 0}} // 이미지파일 첨부 버튼
                        type="file" accept="image/*" onChange={onFileChange} ref={fileInput}/>
                    </div>
                </div>
                <input
                type="submit"
                value="Update Profile"
                className="formBtn"/>
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
            <div>
                {myPosts.map(post => (
                 <Post key={post.id} postObj={post} isOwner={post.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    )
}