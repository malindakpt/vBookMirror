import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button,
} from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import classes from './Header.module.scss';
import { getDoc } from '../../../data/Store';
import { NavPanel } from '../../presentational/navPanel/NavPanel';

export const Header:React.FC = () => {
  useEffect(() => {
    // getDoc('school', '3jfPL8tdayJTjDSzf2O9').then((data) => console.log(data));
  }, []);

  const [user, setUser] = useState < any | null >(null);
  const signInwithToken = () => {
    console.log(user?.token);
    firebase.auth().signInWithCustomToken(user?.token || '').then((result: any) => {
      console.log(result);
    });
  };
  const handleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result:any) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = result.credential.accessToken;
      console.log(token);
      // The signed-in user info.
      const user2 = result.user;
      setUser({
        displayName: result.displayName,
        email: result.email,
        photoURL: result.photoURL,
        token: result.credential.idToken,
      });

      console.log(user2);
      console.log(result.credential);

      // setName(user.displayName);
      // ...
    }).catch((error) => {
      // // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // // The email of the user's account used.
      // const { email } = error;
      // // The firebase.auth.AuthCredential type that was used.
      // const { credential } = error;
      // // ...
    });
  };

  // const handleLogout = () => {
  //   firebase.auth().signOut().then(() => {
  //     // Sign-out successful.
  //     // setName(null);
  //   }).catch((error) => {
  //     // An error happened.
  //   });
  // };

  return (
    <AppBar position="static">
      <Toolbar>
        <NavPanel />
        <Typography
          variant="h6"
          className={classes.title}
        >
          SMS
        </Typography>
        <Button
          color="inherit"
          onClick={handleLogin}
        >
          New Login
        </Button>
        <Button
          color="inherit"
          onClick={signInwithToken}
        >
          Re login
        </Button>
        {/* <img src */}
      </Toolbar>

    </AppBar>
  );
};

export default Header;
