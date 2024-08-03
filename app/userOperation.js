import { db } from "./firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "./authContext";

export const addUserData = async (data) => {
  const { user } = useAuth();
  if (!user) throw new Error("User not authenticated");

  try {
    await addDoc(collection(db, `users/${user.uid}/userData`), data);
  } catch (error) {
    console.error("Error adding user data" + error);
    throw error;
  }
};

export const getUserData = async () => {
    const { user } = useAuth();
    if (!user) throw new Error('User not authenticated')

        try {
            const q = query(collection(db, `users/${user.uid}/userData`))
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        } catch (error) {
            console.error("Error getting user data" + error)
            throw error
        }
}