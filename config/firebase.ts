import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  OAuthProvider,
 } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID
}

const firebaseApp = initializeApp(firebaseConfig);
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
  locale: 'ko_KR'
})

export const appleSignInWithPopup = () => {
  return signInWithPopup(firebaseAuth, AppleAuthProvider)
  .then(result => {
    // user info
    const user = result.user;
    // apple credential
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
