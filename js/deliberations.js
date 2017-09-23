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

  let brotherId = "";

  // Signing In
  document.querySelector("#signin-button").addEventListener("click", function() {
    const codeEntered = (Number.parseInt(document.querySelector("#passcode-input-box").value) - 3)/11;

    // Condition is required due to firebase broken path error
    if (codeEntered >= 0 && Math.abs(codeEntered - Math.round(codeEntered)) < 0.0001) {
      if (brotherArr[codeEntered]) {
        brotherId = brotherArr[codeEntered];
        console.log(brotherId);
      }

      db.ref("brotherArr/" + codeEntered).once("value").then(function(snap) {
        if (!snap.val()) {
          document.querySelector("#feedback").innerHTML = "Code is invalid";

        // Valid code inputted
        } else {
          db.ref("event/sep-23-2017-10/brothers/" + snap.val()).set("attended");
          document.querySelector("#passcode-input-box").style.display = "none";
          document.querySelector("#signin-button").style.display = "none";
          document.querySelector("#feedback").style.display = "none";
          document.querySelector("#voting-frame").style.display = "block";
        }
      });

    // If condition is not met, send error message
    } else {
      document.querySelector("#feedback").innerHTML = "Code is invalid";
    }
  });

  // Deliberations procedure
  db.ref("pnm").once("value").then(function(snap) {
  	let isActive = false,
  	  activePNM = "";
    snap.forEach(function(childSnap) {
      let pnm = childSnap.val();
      if (pnm.active) {
        isActive = true;
        document.querySelector("#voting-frame").innerHTML = '<p id="pnm-name">' + pnm.name + '</p>'
          + '<p style="text-align: center;">'
          + '<a class="pnm-link" href="https://gammanuadmin.github.io/resources/pdf/' + childSnap.key + '-app.pdf" target="_blank">View Application</a></p>'
          + '<p style="text-align: center; margin-top: 30px;">'
          + '<a class="pnm-link" href="https://gammanuadmin.github.io/resources/pdf/' + childSnap.key + '-res.pdf" target="_blank">View Resume</a></p>';
      }
      if (pnm.active && pnm.votingStarted) {
        let p = document.createElement("p"),
          yes = document.createElement("button"),
          no = document.createElement("button");

        p.style.textAlign = "center";
        yes.innerHTML = "Yes";
        yes.className = "yes-button";
        no.innerHTML = "No";
        no.className = "no-button";

        p.appendChild(yes);
        p.appendChild(no);
        document.querySelector("#voting-frame").appendChild(p);
      }
    });
    if (!isActive) {
      document.querySelector("#voting-frame").innerHTML = '<p '
        + 'style="font-family: sans-serif; font-size: 28px; font-weight: bold; text-align: center; padding-top: 200px;"'
        + '>Please wait for active discussion of a PNM to begin.</p>';
    }
  });

  db.ref("pnm").on("child_changed", function(childSnap) {
    let pnm = childSnap.val();
    if (pnm.active) {
      document.querySelector("#voting-frame").innerHTML = '<p id="pnm-name">' + pnm.name + '</p>'
        + '<p style="text-align: center;">'
        + '<a class="pnm-link" href="https://gammanuadmin.github.io/resources/pdf/' + childSnap.key + '-app.pdf" target="_blank">View Application</a></p>'
        + '<p style="text-align: center; margin-top: 30px;">'
        + '<a class="pnm-link" href="https://gammanuadmin.github.io/resources/pdf/' + childSnap.key + '-res.pdf" target="_blank">View Resume</a></p>';
    }
    if (pnm.active && pnm.votingStarted) {
      let p = document.createElement("p"),
        yes = document.createElement("button"),
        no = document.createElement("button");

      p.style.textAlign = "center";
      yes.innerHTML = "Yes";
      yes.className = "yes-button";
      no.innerHTML = "No";
      no.className = "no-button";

      p.appendChild(yes);
      p.appendChild(no);
      document.querySelector("#voting-frame").appendChild(p);
    }
    if (!(pnm.active || pnm.votingStarted)) {
      document.querySelector("#voting-frame").innerHTML = '<p '
        + 'style="font-family: sans-serif; font-size: 28px; font-weight: bold; text-align: center; padding-top: 200px;"'
        + '>Please wait for active discussion of a PNM to begin.</p>';
    }
  });

  document.addEventListener("click", function(e) {
    let target = e.target;
    if (target.className == "yes-button") {
      let pnmKey = document.querySelector("#pnm-name").innerHTML.replace(" ", "").toLowerCase();

      db.ref("pnm/" + pnmKey + "/votes/" + brotherId).set("yes");
      document.querySelectorAll("button").forEach(function(button) {
        button.style.display = "none";
      });
      document.querySelector("#voting-frame").innerHTML = '<p '
        + 'style="font-family: sans-serif; font-size: 28px; font-weight: bold; text-align: center; padding-top: 200px;"'
        + '>Vote has been submitted</p>';
    }
    if (target.className == "no-button") {
      let pnmKey = document.querySelector("#pnm-name").innerHTML.replace(" ", "").toLowerCase();

      db.ref("pnm/" + pnmKey + "/votes/" + brotherId).set("no");
      document.querySelectorAll("button").forEach(function(button) {
        button.style.display = "none";
      });
      document.querySelector("#voting-frame").innerHTML = '<p '
        + 'style="font-family: sans-serif; font-size: 28px; font-weight: bold; text-align: center; padding-top: 200px;"'
        + '>Vote has been submitted</p>';
    }
  });
});