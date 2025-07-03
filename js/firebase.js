// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Export Firebase services
export const initializeFirebase = async (config) => {
    const app = initializeApp(config);
    const auth = getAuth(app);
    const db = getFirestore(app);
    return { auth, db };
};

export { 
    signInAnonymously, 
    signInWithCustomToken, 
    onAuthStateChanged,
    collection,
    addDoc,
    onSnapshot,
    query
};