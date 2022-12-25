import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  OAuthProvider,
 } from 'firebase/auth';
 import { getAnalytics } from 'firebase/analytics';
import App from '../pages/_app';

const firebaseConfig = {
  apiKey: "AIzaSyD1h0FSx9DR-eUo05yc3oRP1AI_u3KbyQE",
  authDomain: "the-beginning-of-a-hobby.firebaseapp.com",
  projectId: "the-beginning-of-a-hobby",
  storageBucket: "the-beginning-of-a-hobby.appspot.com",
  messagingSenderId: "320601432562",
  appId: "1:320601432562:web:020f374f076b1a75484b6b",
  measurementId: "G-BEWPXDY92V"
}

const firebaseApp = initializeApp(firebaseConfig);
// const firebaseAnalytics = getAnalytics(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);
firebaseAuth.languageCode = 'kr';


// --------------------------------------  google credential -------------------------------------------------
const googleAuthProvider = new GoogleAuthProvider();

// Web(Not Mobile) -> Popup
export const googleSignInWithPopup = <T>():Promise<T|null> => {
  return signInWithPopup(firebaseAuth, googleAuthProvider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;
    return user as T;
  })
  .catch(error => {
    console.error(error);
    return null;
  })
};

// Web(Mobile) -> Redirection


// -------------------------------------- Apple credential -------------------------------------------------
const AppleAuthProvider = new OAuthProvider('apple.com');
AppleAuthProvider.setCustomParameters({
  locale: 'kr'
})

export const appleSignInWithPopup = () => {
  return signInWithPopup(firebaseAuth, AppleAuthProvider)
  .then(result => {
    const user = result.user;
    const credential = OAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;
    const idToken = credential?.idToken;

    return user;
  })
  .catch(error => {
    console.log({error});
    return null;
  })
}

// ------------------------- firebase hosting -------------------------
// production 이 준비되면 정적 파일을 배포 디렉터리에 넣고
// $ firebase deploy
