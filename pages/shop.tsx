import React, {useContext, useEffect, useMemo, useState} from 'react'
import {Button} from "@material-ui/core";
import axios from "axios";
import {GetServerSideProps, NextPage} from "next";
import Headers from "../layout/Headers";
import {Context, GlobalContent} from "./index";
import {useAuthState} from "react-firebase-hooks/auth";
import {useRouter} from "next/router";
import {SandBoxOrderSuccessType} from "./api/sandbox";
import {OrderResponseSuccessType} from "./api/order";
import {NotifyStatusType} from "./api/notify";

const Shop: NextPage<PropsType> = ({response}) => {

    const {auth} = useContext<GlobalContent>(Context)
    const [statusOrder, setStatusOrder] = useState<OrderResponseSuccessType | null>(null)
    const [statusNotify, setStatusNotify] = useState<Array<NotifyStatusType>>([]);
    const [orderStatusInterval, setOrderStatusInterval] = useState<NodeJS.Timer | null>(null);
    const [user] = useAuthState(auth)
    const router = useRouter()

    const getStatusNotify = async () => {
        const response = await axios.get<Array<NotifyStatusType>>(`http://test-shopm.herokuapp.com/api/notify`)
        setStatusNotify(response.data)
    }

    useEffect(() => {
        if (!user) {
            router.push('/')
        }
    }, [router, user])


    const handlerClickBay = async () => {
        const order = await axios.get<SandBoxOrderSuccessType>(
            `http://test-shopm.herokuapp.com/api/sandbox?token=${response.access_token}`
        )
        window.open(order.data.redirectUri);
        if (order.status === 200) {
            const status = await axios.get<OrderResponseSuccessType>(
                `http://test-shopm.herokuapp.com/api/order?token=${response.access_token}&order=${order.data.orderId}`
            )
            setStatusOrder(status.data)
        }

        if (orderStatusInterval === null) {
            setOrderStatusInterval(setInterval(() =>
                getStatusNotify(), 10000)
            )
        } else {
            clearInterval(orderStatusInterval)
            setOrderStatusInterval(setInterval(() =>
                getStatusNotify(), 10000)
            )
        }
    }

    const mapStatusNotify = useMemo(() => (
            statusNotify.map( notify => (
                <ul key={notify.order.orderId}>
                    <li>
                        Orders: { notify.order.orderId }
                        Status: { notify.order.status }
                    </li>
                 </ul>)
            )
    ), [statusNotify])

    return (
        <>
            <Headers auth={auth}>
                <Button onClick={getStatusNotify} variant={"outlined"} style={{marginLeft: 20}}>Get status</Button>
                <div style={{marginBottom: 20}}>
                    {mapStatusNotify}
                </div>
                <div style={{marginBottom: 20}}>
                    {statusOrder && <span style={{color: "green"}}>New Order: {statusOrder.orders[0].orderId} Status:{statusOrder.orders[0].status}</span>}
                </div>
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

