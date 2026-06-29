import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDIIaw_Dvhe0iMloRtGXkoLP92kSPgntGA",
  authDomain: "makepro-dac15.firebaseapp.com",
  projectId: "makepro-dac15",
  storageBucket: "makepro-dac15.firebasestorage.app",
  messagingSenderId: "62186038362",
  appId: "1:62186038362:web:cb646955e614ce04446463"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
