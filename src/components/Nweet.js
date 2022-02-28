import React, { useState } from "react";
import { dbService, storageService  } from "myFirebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons"

const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNweNweet] = useState(nweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        console.log(ok);
        if(ok){
            const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
            // delete nweet
            await deleteDoc(NweetTextRef);
            const urlRef = ref(storageService, nweetObj.attachmentURL)
            // delete file
            await deleteObject(urlRef);
        }
    }
    const toggleEditing = () => setEditing(prev => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
        await updateDoc(NweetTextRef,{
            text: newNweet,
        })
        setEditing(false);
    }
    const onChange = (event) => {
        const {target:{value}} = event;
        setNweNweet(value);
    }
    return (
        <div className="nweet">
            {editing ? (
                <>
                    <form onSubmit={onSubmit}
                    className="container nweetEdit">
                        <input type="text" value={newNweet} onChange={onChange} required autoFocus className="formInput"/>
                        <input type="submit" value="Update Nweet" className="formBtn"/>
                    </form>
                    <span onClick={toggleEditing}
                    className="formBtn cancelBtn">Cencel</span>
                </>
                ) : (
                <>
                    <h4>{nweetObj.text}</h4>
                    {nweetObj.attachmentURL && (
                        <img src={nweetObj.attachmentURL}/>
                    )}
                    {isOwner && (
                    <div className="nweet__actions">
                        <span onClick={onDeleteClick}>
                            <FontAwesomeIcon icon={faTrash}/>
                            </span>
                        <span onClick={toggleEditing}>
                            <FontAwesomeIcon icon={faPencilAlt}/>
                            </span>
                    </div>
                    )}
                </>)}
        </div>
    )
};

export default Nweet;