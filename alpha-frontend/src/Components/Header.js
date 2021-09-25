import React, { useState, useEffect } from "react";
import { getModalStyle, useStyles } from "./Modalpop";
import { auth } from "../firebase";
import { Button, Input, Modal } from "@material-ui/core";
import "../Styles/Header.css";
import Checkbox from "@mui/material/Checkbox";

const Header = () => {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [checkedBox, setCheckedBox] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  useEffect(() => {
    // step for authentication
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user is logged in...
        setUser(authUser);
        if (authUser.displayName) {
          // dont update username
        } else {
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, username]);

  const handleCheckBoxChange = (e) => {
    setEmail(username + "@randomemail.com"); //CheckBox is a fascade to set email for username
    setCheckedBox(e.target.checked);
  };

  const handlePreLogin = () => {
    auth.signOut(); //To prevent user from signing in directly after registering.
    setLoginModalOpen(true);
    setCheckedBox(false);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setRegisterModalOpen(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setLoginModalOpen(false);
  };

  return (
    <div className="header">
      <h1>
        Project
        <img
          className="header__logo"
          src="https://firebasestorage.googleapis.com/v0/b/project-alpha-a4d5a.appspot.com/o/logo%2Falpha-logo.png?alt=media&token=3865e164-a31c-4c96-90ad-0ba0d9c0119c"
          alt="Alpha"
        />
      </h1>
      {user?.displayName ? (
        <div className="header__right">
          <h2>{user.displayName}</h2>
          <Button onClick={() => auth.signOut()}>Logout</Button>
        </div>
      ) : (
        <div className="header__right">
          <Button onClick={handlePreLogin}>Login</Button>
          <Button onClick={() => setRegisterModalOpen(true)}>Sign Up</Button>
          <Modal open={loginModalOpen} onClose={() => setLoginModalOpen(false)}>
            <div style={modalStyle} className={classes.paper}>
              <form className="app__login">
                <Input
                  placeholder="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <Input
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="header__checkBox">
                  <p>This is a project site, post appropriately</p>
                  <Checkbox
                    checked={checkedBox}
                    onChange={handleCheckBoxChange}
                  />
                </div>
                <Button disabled={!checkedBox} onClick={handleLogin}>
                  Login
                </Button>
              </form>
            </div>
          </Modal>
          <Modal
            open={registerModalOpen}
            onClose={() => setRegisterModalOpen(false)}
          >
            <div style={modalStyle} className={classes.paper}>
              <form className="app__login">
                <Input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <Input
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="header__checkBox">
                  <p>Keep an easy to remember username and password</p>
                  <Checkbox
                    checked={checkedBox}
                    onChange={handleCheckBoxChange}
                  />
                </div>

                <Button disabled={!checkedBox} onClick={handleRegister}>
                  Register
                </Button>
              </form>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Header;
