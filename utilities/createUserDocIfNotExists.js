import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";


export async function createUserDocIfNotExists(user) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  // Check if the user doc already exists
  const userSnapshot = await getDoc(userRef);

  if (userSnapshot.exists()) {
    console.log("User doc already exists. No need to overwrite fields.");
    return;
  }
  
  await setDoc(
    userRef,
    {
      displayName: user.displayName || null,
      email: user.email || null,
      photoURL: user.photoURL || null,
      friends: [] ,
      likedPosts: [],
    },
    { merge: true }
  );
}
