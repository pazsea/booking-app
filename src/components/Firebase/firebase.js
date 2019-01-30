import app from "firebase/app";

import "firebase/database";
import "firebase/auth";

var config = {
  apiKey: "AIzaSyAyiEnQ8kK74eH7UJ7BjsaHRoSZQcuqikU",
  authDomain: "grex-6d87e.firebaseapp.com",
  databaseURL: "https://grex-6d87e.firebaseio.com",
  projectId: "grex-6d87e",
  storageBucket: "grex-6d87e.appspot.com",
  messagingSenderId: "1086033718659"
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  createGrouproomWithDateAndTime = (groupRoom, date, time) =>
    this.db.createGrouproomWithDateAndTime(groupRoom, date, time);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  // *** User API ***

  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref("users");

  groupRoom = uid => this.db.ref(`groupRooms/${uid}`);

  groupRooms = () => this.db.ref("groupRooms");
}

export default Firebase;
