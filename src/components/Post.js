import React, { useState } from "react";
import { dbService, storageService  } from "myFirebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons"
import 'post.css' 
const Post = ({ postObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newPost, setNwePost] = useState(postObj.text);
    const onDeleteClick = async () => {
        // 게시글 삭제 함수
        const ok = window.confirm("Are you sure you want to delete this post?");
        console.log(ok);
        if(ok){
            const PostTextRef = doc(dbService, "posts", `${postObj.id}`);
            // delete post
            await deleteDoc(PostTextRef);
            const urlRef = ref(storageService, postObj.attachmentURL)
            // delete file
            await deleteObject(urlRef);
        }
    }
    // 게시글 편집 여부 토글 함수
    const toggleEditing = () => setEditing(prev => !prev);
    const onSubmit = async (event) => {
        // 게시글 업데이트
        event.preventDefault();
        const PostTextRef = doc(dbService, "posts", `${postObj.id}`);
        await updateDoc(PostTextRef,{
            text: newPost,
        })
        setEditing(false);
    }
    const onChange = (event) => {
        const {target:{value}} = event;
        setNwePost(value);
    }
    return (
        <div className="post">
            {editing ? ( // 게시글 편집 상태
                <>
                    <form onSubmit={onSubmit}
                    className="container postEdit">
                        <input type="text" value={newPost} onChange={onChange} 
                        required autoFocus className="formInput"/>
                        <input type="submit" value="Update Post" className="formBtn"/>
                    </form>
                    <span onClick={toggleEditing}
                    className="formBtn cancelBtn">Cencel</span>
                </>
                ) : ( // 기본 상태
                <>  {postObj.creatorName ? (<h4 className="posterName">{postObj.creatorName}</h4>) : (<h4 className="posterName">이름 설정 안한 멍청이</h4>)}
                    <h4>{postObj.text}</h4>
                    {postObj.userProfileImg &&
                    (<img className="userProfileImg" src={postObj.userProfileImg ? (postObj.userProfileImg):(require("img/user.png"))}/>)}
                    {postObj.attachmentURL && // 게시글에 이미지가 있을 경우 이미지 표시
                    (<img className="postImg" src={postObj.attachmentURL}/>)}
                    {isOwner && ( // 게시글 작성자 본인인 경우 편집,삭제버튼 표시
                        <div className="post__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash}/>
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt}/>
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    )
};

export default Post;