import { authService, dbService } from "myFirebase";
import { collection, getDocs, query, where, orderBy } from "@firebase/firestore";
import { updateProfile } from "@firebase/auth";
import React, { useEffect, useState } from "react";

export default ({ userObj, refreshUser }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut()
        refreshUser();
    };
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
        <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
                <input type="text" 
                placeholder="Display name"
                onChange={onChange}
                autoFocus
                value={newDisplayName}
                className="formInput"/>
                <input
                type="submit"
            value="Update Profile"
            className="formBtn"
            style={{
                marginTop: 10,
            }} />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
        </div>
    )
}