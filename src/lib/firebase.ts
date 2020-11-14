import firebase from "firebase/app";
// Required for side-effects
import "firebase/firestore";
import { GeoFirestore } from "geofirestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjXx1AqIQnkyKkCPh8HZKZYyiKGfiLcbc",
  authDomain: "contracting-app.firebaseapp.com",
  databaseURL: "https://contracting-app.firebaseio.com",
  projectId: "contracting-app",
  storageBucket: "contracting-app.appspot.com",
  messagingSenderId: "557426956160",
  appId: "1:557426956160:web:c1393a9710ed0e40151365"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore(),
  geoFirestore = new GeoFirestore(firestore)