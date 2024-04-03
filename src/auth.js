import {
  GoogleAuthProvider,
  getAuth,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { app } from "./data";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export async function signIn() {
  const result = await getRedirectResult(auth);
  if (result) {
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...

    console.log("token è user", token, user);
  } else {
    console.log("redirecting.............");
    await signInWithRedirect(auth, provider);
  }
  // .catch((error) => {
  //   console.log("error", error);

  //   // Handle Errors here.
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   // The email of the user's account used.
  //   // const email = error.customData.email;
  //   // The AuthCredential type that was used.
  //   const credential = GoogleAuthProvider.credentialFromError(error);
  //   // ...
  // });
}
