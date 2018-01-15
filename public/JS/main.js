  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyANj7FOcSjM85VPKOHY-TZDJIcuZUHr8jA",
    authDomain: "shaked-nysl-app.firebaseapp.com",
    databaseURL: "https://shaked-nysl-app.firebaseio.com",
    projectId: "shaked-nysl-app",
    storageBucket: "",
    messagingSenderId: "352336538584"
  };
  firebase.initializeApp(config);

 document.addEventListener('DOMContentLoaded', function() {
        // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
        // // The Firebase SDK is initialized and available here!
        //
        // firebase.auth().onAuthStateChanged(user => { });
        // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
        // firebase.messaging().requestPermission().then(() => { });
        // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
        //
        // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

        try {
          let app = firebase.app();
          let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');

        } catch (e) {
          console.error(e);
        }
      });