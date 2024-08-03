import { auth, db } from "./firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

export const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        await setDoc(doc(db, 'users', user.uid), {
            email: user.email
        });
        return user;
    } catch (error) {
        console.error('Error signing up:' + error);
        throw error;
    }
}

export const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        return userCredential.user;
    } catch (error) { 
        console.error('Error signing in' + error);
        throw error;
    }
}

export const SignOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out' + error)
        throw error;
    }
}
