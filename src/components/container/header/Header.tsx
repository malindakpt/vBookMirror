import React, { useState, useContext, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button,
} from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import classes from './Header.module.scss';
import { NavPanel } from '../../presentational/navPanel/NavPanel';
import { AppContext } from '../../../App';
import { Entity, getDocsWithProps } from '../../../data/Store';
import { ITeacher } from '../../../interfaces/ITeacher';
import { Util } from '../../../helper/util';

export const Header:React.FC = () => {
  const [user, setUser] = useState <{name: '', photo: ''} | null>(null);
  const { setEmail, setIsTeacher, showSnackbar } = useContext(AppContext);

  const setUserDetails = (result: any) => {
    let email;
    if (result.user) {
      email = result.user.email;
    } else {
      email = result.email;
    }

    setEmail(email);
    Util.fullName = result.displayName;

    setUser({
      name: result.displayName,
      photo: result.photoURL,
    });

    getDocsWithProps<ITeacher>(Entity.TEACHERS, { ownerEmail: email }).then((data) => {
      if (data.length > 0) {
        setIsTeacher(true);
      } else {
        setIsTeacher(false);
      }
    });
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((u: any) => {
      console.log('AuthChanged');
      if (u) {
        setUserDetails(u);
      } else {
        setEmail(null);
        setIsTeacher(false);
      }
    });
    // eslint-disable-next-line
  }, []);

  const handleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider).then((result:any) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const token = result.credential.accessToken;
      // const user2 = result.user;
      setUserDetails(result);
      // window.location.reload();

      // setName(user.displayName);
      // ...
    }).catch((error) => {
      console.log('Login error', error);
      showSnackbar('Allow Popups from your browser or Please try again in few minutes');
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

  Util.invokeLogin = handleLogin;

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
    <AppBar
      position="static"
      color="primary"
    >
      <Toolbar className={classes.container}>
        <NavPanel />
        <Typography
          variant="h6"
          className={classes.title}
        >
          ???????????????.lk
        </Typography>
        <Button
          color="inherit"
          onClick={handleLogin}
        >
          {user?.name ? (
            <span
              className={classes.userName}
              id="fullName"
            >
              {user?.name}
            </span>
) : 'Login'}
        </Button>
        { user && user.photo && (
          <img
            className={classes.pic}
            alt={user?.name}
            src={user?.photo}
          />
        )}
        { user && (
        <Button
          color="inherit"
          onClick={handleLogout}
        >
          <PowerSettingsNewIcon style={{ fontSize: 25 }} />
        </Button>
        )}

      </Toolbar>

    </AppBar>
  );
};

export default Header;
