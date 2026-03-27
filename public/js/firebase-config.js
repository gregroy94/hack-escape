// ============================================================
// CONFIGURATION FIREBASE - Remplacez par vos propres valeurs
// (disponibles dans la console Firebase > Paramètres du projet)
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyAI0ky3Sed2b_iLzVIs1hSivJhFz9BstBk",
  authDomain: "hackescape-cea21.firebaseapp.com",
  databaseURL: "https://hackescape-cea21-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hackescape-cea21",
  storageBucket: "hackescape-cea21.firebasestorage.app",
  messagingSenderId: "1080262578742",
  appId: "1:1080262578742:web:8a4f3db3b14fe737b0be97"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
