import {initializeApp} from "firebase/app";
//import firebase from "firebase/app";

import {getStorage} from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyA3RGtE0I8WhtxHEmdFSj6zWUok80l-iXs",
    authDomain: "image-gearlap-upload-596f7.firebaseapp.com",
    projectId: "image-gearlap-upload-596f7",
    storageBucket: "image-gearlap-upload-596f7.appspot.com",
    messagingSenderId: "348477973433",
    appId: "1:348477973433:web:759a74aa2f0a5c03a20c68",
    measurementId: "G-BMPF85JEJB"
  };

  export const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
