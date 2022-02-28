import { authService, dbService } from "myFirebase";
import { collection, getDocs, query, where, orderBy } from "@firebase/firestore";
import { updateProfile } from "@firebase/auth";
import React, { useEffect, useState } from "react";

export default ({ userObj, refreshUser }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => authService.signOut();
    const onChange = (event) => {
        const { target: { value } } = event;
        setNewDisplayName(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await updateProfile(authService.currentUser, {displayName: newDisplayName});
            // 프사 업로드 기능도 만들어보기!
            refreshUser();
        }
    }
    const getMyNweets = async () => {
        const q = query(
            collection(dbService, "nweets"),
            where("creatorId", "==", userObj.uid),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            //console.log(doc.id, " => ", doc.data());
        });
    };
    useEffect(() =>{
        getMyNweets();
    })
    
    return (
        <>
            <form onSubmit={onSubmit}>
                <input type="text" 
                placeholder="Display name"
                onChange={onChange}
                value={newDisplayName}/>
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
}