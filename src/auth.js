import {
  GoogleAuthProvider,
  getAuth,
  getRedirectResult,
  signInWithRedirect,
} from "firebase/auth";
import { app } from "./firebase";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export async function signIn() {
  const result = await getRedirectResult(auth);
  if (!result) {
    await signInWithRedirect(auth, provider);
  }
}
