import React, {useContext, useEffect} from 'react'
import {Button} from "@material-ui/core";
import axios from "axios";
import {GetServerSideProps, NextPage} from "next";
import Headers from "../layout/Headers";
import {Context, GlobalContent} from "./index";
import {useAuthState} from "react-firebase-hooks/auth";
import {useRouter} from "next/router";

const Shop: NextPage<PropsType> = ({ response}) => {

    const {auth} = useContext<GlobalContent>(Context)
    const [user] = useAuthState(auth)
    const router = useRouter()

    useEffect(()=>{
        if (!user){
            router.push('/')
        }
    },[router, user])

    const order = {
        "notifyUrl": "https://bsstart2017.github.io",
        "customerIp": "127.0.0.1",
        "merchantPosId": "300746",
        "description": "RTV market",
        "currencyCode": "PLN",
        "totalAmount": "21000",
        "buyer": {
            "email": "nicepk.by@gmail.com",
            "phone": "654111654",
            "firstName": "John",
            "lastName": "Doe",
            "language": "pl"
        },
        "products": [
            {
                "name": "Wireless Mouse for Laptop",
                "unitPrice": "15000",
                "quantity": "1"
            },
            {
                "name": "HDMI cable",
                "unitPrice": "6000",
                "quantity": "1"
            }
        ]
    }


    const handlerClickBay = async () => {

        const instance = axios.create({
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${response?.access_token}`
            },
            baseURL: 'https://secure.snd.payu.com/'
        })
        try {
            const response = await instance.post(`api/v2_1/orders`, order)
            console.log(response)
        } catch (e) {
            console.log(e)
        }

    }

    return (
        <>
            <Headers auth={auth}>
                <Button onClick={handlerClickBay} variant={"outlined"}>Buy</Button>
            </Headers>

        </>
    )
}

export default Shop;

export const getServerSideProps: GetServerSideProps = async () => {
    const baseURL = 'https://secure.snd.payu.com/'
    const response = await axios.post<PostAuthorizeToken>(
        `${baseURL}pl/standard/user/oauth/authorize?grant_type=client_credentials&client_id=${process.env.NEXT_PUBLIC_SANDBOX_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_SANDBOX_CLIENT_SECRET}`
    )
    return {
        props: {
            response: response.data
        }
    }
}

type PostAuthorizeToken = {
    access_token: string
    token_type: string
    expires_in: number
    grant_type: string
}

type PropsType = {
    response: PostAuthorizeToken
}