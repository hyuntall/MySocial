import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "myFirebase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    // 인증 정보 확인
    authService.onAuthStateChanged((user) => {
      if(user){
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(user, {displayName: user.displayName, photoURL: user.photoURL}),
        });
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, [])
  const refreshUser = () => {
    // 유저 정보 변경 시 리프레시 하는 함수
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  }
  return (// 인증 정보 확인 완료 시 앱라우터에 유저 정보와 로그인 유무 전달
  <>
    {init ? <AppRouter 
    refreshUser={refreshUser}
    isLoggedIn={isLoggedIn} 
    userObj={userObj}/> : "Initializing..."}
    <footer>&copy; Nwitter {new Date().getFullYear()}</footer>
  </>
  )
}

export default App;
