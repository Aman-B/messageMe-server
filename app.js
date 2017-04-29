
/**
 * Copyright 2016, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START app]
'use strict';

const express = require('express');
const app = express();

var firebase = require('firebase-admin');
var request = require('request');

var API_KEY = "AAAAnX_kHRs:APA91bEGAGkbk9hSzeejEsBpoMsX_DGxWPTi4oEAFU_yBFPFoMVcChkBOOCo02PffaYeJwCyJSbvaYrVDQKJ1Fh74CcjGLUG2Ax30_O-TQwBzHYSv6ICeOxWN0dSkvIPruJchloNZLLQ"; // Your Firebase Cloud Messaging Server API key

// Fetch the service account key JSON file contents
var serviceAccount = require("./messageme-480335bf32f2.json");

  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://messageme-e0090.firebaseio.com/"
  });
  

    console.log("here!");

var ref = firebase.database().ref();
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
    // Initialize the app with a service account, granting admin privileges


  // start listening
  listenForNotificationRequests();
});
// [END app]

// app.get('/', (req, res) => {
//   console.log("here")
// });

function sendNotificationToUser(username, message, onSuccess) {
  request({
    url: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST',
    headers: {
      'Content-Type' :' application/json',
      'Authorization': 'key='+API_KEY
    },
    body: JSON.stringify({
      notification: {
        title: message
      },
      to : '/topics/user_'+username
    })
  }, function(error, response, body) {
    if (error) { console.error(error); }
    else if (response.statusCode >= 400) { 
      console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage); 
    }
    else {
      console.log('Success!');
    }
  });
}




function listenForNotificationRequests() {
  var requests = ref.child('test');

  requests.on('child_added', function(requestSnapshot) {
    var request = requestSnapshot.val();
    sendNotificationToUser(
      request.username, 
      request.message,
      function() {
        requestSnapshot.ref.remove();
      }
    );
  }, function(error) {
    console.error(error);
  });
};



