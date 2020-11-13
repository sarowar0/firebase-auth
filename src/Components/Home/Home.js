import React, { useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from '../../firebase.Config';
import './Home.css'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

firebase.initializeApp(firebaseConfig);

const Home = () => {
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  var fbProvider = new firebase.auth.FacebookAuthProvider();
  var githubProvider = new firebase.auth.GithubAuthProvider();

  const [newUser, setNewUser] = useState(false)

  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    photo: '',
    password: '',
    error: '',
    success: false
  });

  //This is sign in with google event handler

  const signInHandler = () => {
    firebase.auth().signInWithPopup(googleProvider)
      .then(res => {
        const { displayName, email, photoURL } = res.user;
        setUser({
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        })
      })
  }

  //Sing in with facebook
  const fbSignInHandler = () => {
    firebase.auth().signInWithPopup(fbProvider)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        setUser({
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        })
        console.log(result.user);
      })
      .catch(error => {
        var errorMessage = error.message;
        console.log(errorMessage);
      });
  }


  //Sign in with github
  const githubSignInHandler = () => {
    firebase.auth().signInWithPopup(githubProvider)
      .then(function (result) {
        var user = result.user;
        console.log(user);

      }).catch(function (error) {
        var errorMessage = error.message;
        console.log(errorMessage);
      });
  }

  //This is sign out with google event handler
  const signOutHandler = () => {
    firebase.auth().signOut()
      .then(res => {
        setUser({
          isSignIn: false,
          name: "",
          email: "",
          photo: "",
        })
      })
  }

  //This is sign in form validittion
  const formInputHandler = (e) => {
    let isFieldValid = true;
    if (e.target.name == 'name') {
      isFieldValid = e.target.value;
    }
    if (e.target.name == 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value)
    }
    if (e.target.name == 'password') {
      isFieldValid = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(e.target.value)
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo)
    }
  }

  //This is common function of form submit
  const success = () => {
    const newUserInfo = { ...user };
    newUserInfo.error = "";
    newUserInfo.success = true;
    setUser(newUserInfo);
  }

  const err = (error) => {
    const newUserInfo = { ...user };
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo)
  }

  //This is submit event handler
  const submitHandler = (e) => {
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          success()
        })
        .catch(function (error) {
          err(error)
        });
    }

    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          success()
        })
        .catch(function (error) {
          err(error)
        });
    }
    e.preventDefault()
  }


  return (
    <div className='Home'>
      {
        user.isSignIn ? <button onClick={signOutHandler} className='btn btn-success m-4'>Sign Out</button> :
          <button onClick={signInHandler} className='btn btn-success m-4'>Google Sign In</button>
      }
      <button onClick={fbSignInHandler} className='btn btn-success'>Facebook sign in</button>
      <button onClick={githubSignInHandler} className='btn btn-success ml-4'>Github sing in</button>
      {
        user.isSignIn && <div>
          <h2>Welcome {user.name}</h2>
          <h6>Your email- {user.email}</h6>
          <img src={user.photo} alt="" />
        </div>
      }

      <form onSubmit={submitHandler} className='form'>
        <h4 className='text-left text-success text-uppercase'>{newUser ? 'Sign up' : 'Sign in'}</h4>
        {newUser && <div className='d-flex justify-content-between w-100'> <input type="text" onBlur={formInputHandler} name="Lname" placeholder="First Name" required />
          <input type="text" name='fName' placeholder='Last name' required />
        </div>
        }
        <br />
        <input type="text" onBlur={formInputHandler} name="email" placeholder="Your email address" required className='w-100' />
        <br /><br />
        {
          newUser && <> <input type="text" onBlur={formInputHandler} name="email" placeholder="Your email address" required className='w-100' />
            <br /> <br />
          </>
        }
        <input type="password" onBlur={formInputHandler} name="password" placeholder="Your password" required className='w-100' />
        <br /><br />
        <input type="submit" value={newUser ? "Sing Up" : "Sign In"} className="btn btn-success w-100" />

        {/* <a onClick={setNewUser(!newUser)} href="#" className='float-right mt-2'>Don't have an account? Sign Up</a> */}
        <input type="checkbox" onChange={() => { setNewUser(!newUser) }} name="newUser" id="" className='mr-2' />
        <label htmlFor="newUser">Create new user</label><br />
      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      {
        user.success && <p style={{ color: 'green' }}>Your {newUser ? 'created' : 'Logged In'} successfully</p>
      }


    </div>
  );
};

export default Home;