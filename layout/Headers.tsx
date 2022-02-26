import React, {FC, ReactNode} from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import {Button, Grid} from "@material-ui/core";
import Head from "next/head";
import {Auth, User} from "@firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";
import {useRouter} from "next/router";

const Headers: FC<PropsType> = ({children, auth}) => {

    const [user] = useAuthState(auth)
    const router = useRouter()

    const handlerClickLogOut = () => {
        auth.signOut()
        router.push('/login')
    }

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <AppBar color={"secondary"} position="static">
                <Toolbar variant={"dense"}>
                    <Grid container justifyContent={"flex-end"}>
                        {user && <Button onClick={handlerClickLogOut} variant={"outlined"}>Log uot</Button>}
                    </Grid>
                </Toolbar>
            </AppBar>
            <Grid container style={{height: 300}} alignItems={"center"} justifyContent={"center"}>
                <Grid container alignItems={"center"} direction={"column"}>
                    {children}
                </Grid>
            </Grid>
        </>
    );
}

export default Headers;

type PropsType = {
    children: ReactNode
    auth: Auth
}