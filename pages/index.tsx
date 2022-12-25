import { userAgent } from "next/server";
import { useEffect, useState } from "react"
import { appleSignInWithPopup, googleSignInWithPopup } from "../config/firebase"

export default function Home() {

  const [account, setAccount] = useState<GoogleAccount|null>(null);

  const googleSignInWithPopupHandler = async () => {
    const user = await googleSignInWithPopup<GoogleAccount>();
    if (user) {
      setAccount(user);
    }
  }

  const appleSignInWithPopupHandler = async () => {
    const user = await appleSignInWithPopup();
    if (user) {
      setAccount(user as any);
    }
  }

  return (
    <>
      <button onClick={googleSignInWithPopupHandler} style={{marginRight:100}}>
        Google SignIn
      </button>

      <button onClick={appleSignInWithPopupHandler}>
        Apple SignIn
      </button>

      {account && (
        <>
          <div>displayName : {account.displayName}</div>
          <div>accessToken : {account.accessToken}</div>
          <div>email : {account.email}</div>
          <div>uid : {account.uid}</div>
        </>
      )}
    </>
  )
}
