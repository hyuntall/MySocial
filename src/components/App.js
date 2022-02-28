import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "myFirebase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user){
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(user, {displayName: user.displayName}),
        });
      } else {
        setIsLoggedIn(false);
        //setUserObj(null);
      }
      setInit(true);
    });
  }, [])
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  }
  return (
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
