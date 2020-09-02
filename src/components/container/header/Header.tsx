import React, { useState, useContext, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button,
} from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import classes from './Header.module.scss';
import { NavPanel } from '../../presentational/navPanel/NavPanel';
import { AppContext } from '../../../App';

export const Header:React.FC = () => {
  const [user, setUser] = useState <{name: '', photo: ''} | null>(null);
  const { setEmail } = useContext(AppContext);

  useEffect(() => {
    console.log('Check Prev user');
    firebase.auth().onAuthStateChanged((u: any) => {
      setEmail(u.email);
      setUser({
        name: u.displayName,
        photo: u.photoURL,
      });
    });
  }, []);

  const handleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result:any) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const token = result.credential.accessToken;
      // const user2 = result.user;
      setEmail(result.user.email);
      setUser({
        name: result.displayName,
        photo: result.photoURL,
      });

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

  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      setEmail(null);
      setUser(null);
    }).catch((error) => {
      // An error happened.
    });
  };

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
          {user?.name ?? 'Login'}
        </Button>
        { user && user.photo && (
          <img
            alt={user?.name}
            src={user?.photo}
          />
        )}
        { user && (
        <Button
          color="inherit"
          onClick={handleLogout}
        >
          Logout
        </Button>
        )}

      </Toolbar>

    </AppBar>
  );
};

export default Header;
