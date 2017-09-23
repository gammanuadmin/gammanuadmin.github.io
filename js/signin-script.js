document.addEventListener("DOMContentLoaded", function() {
  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyBUAfZbe77sAo7EPa8OhYUffmO6yAIxI9I",
    authDomain: "akpsi-gamma-nu.firebaseapp.com",
    databaseURL: "https://akpsi-gamma-nu.firebaseio.com",
    projectId: "akpsi-gamma-nu",
    storageBucket: "akpsi-gamma-nu.appspot.com",
    messagingSenderId: "949000743917"
  };
  firebase.initializeApp(config);

  const db = firebase.database();

  // Sign In Button Functionality
  document.querySelector("#signin-button").addEventListener("click", function() {
    const codeEntered = Math.round((Number.parseInt(document.querySelector("#passcode-input-box").value) - 11)/4);
    db.ref("brotherArr/" + codeEntered).once("value").then(function(snap) {
      if (!snap.val()) {
        document.querySelector("#feedback").innerHTML = "Code is invalid";
      } else {
        db.ref("event/" + eventId + "/brothers/" + snap.val()).set("attended");
        document.querySelector("#feedback").innerHTML = "Thanks for signing in!";
        document.querySelector("#passcode-input-box").style.display = "none";
        document.querySelector("#signin-button").style.display = "none";
      }
    });
  });

});