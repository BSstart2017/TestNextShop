import type {NextPage} from 'next'
import styles from '../styles/Home.module.css'
import {initializeApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import React, {createContext, useEffect} from "react"
import Loader from "../components/Loader"
import {useAuthState} from "react-firebase-hooks/auth";
import Headers from "../layout/Headers";
import {useRouter} from "next/router";
import {Auth} from "firebase/auth"
import {Button} from "@material-ui/core";
import Box from "@material-ui/core/Box";

initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    }
)

const auth = getAuth()
export const Context = createContext<GlobalContent>({auth})

const Home: NextPage = () => {

    const [user, loading] = useAuthState(auth)
    const router = useRouter()

    useEffect(() => {
        if(user){
            router.push('/shop')
        }
    },[router, user])

    const login = async () => {
        const provider = new GoogleAuthProvider()
        const {user} = await signInWithPopup(auth, provider)
        if (user){
           await router.push('/shop')
        }
    }

    if (loading) {
        return <Headers auth={auth}><Loader /></Headers>
    }

    return (
        <Context.Provider value={{auth}}>
            <div className={styles.container}>
                <Headers auth={auth} >
                    {!user &&
                        <Box p={5}>
                            <Button onClick={login} variant={"outlined"}>Login with Google</Button>
                        </Box>
                    }
                </Headers>
            </div>
        </Context.Provider>
    )
}

export default Home

export type GlobalContent = {
    auth : Auth
}