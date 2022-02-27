import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import {OrderProductsType} from "./sandbox";

interface OrderBoxNextApiResponse extends NextApiRequest{
    query: {
        token: string
        order: string
    }
}

const order = async (req: OrderBoxNextApiResponse, res: NextApiResponse) =>{
    res.statusCode = 200
    const instance = axios.create({
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${req.query.token}`,
        },
        maxRedirects: 0,
        baseURL: 'https://secure.snd.payu.com/'
    })
    const response = await instance.get<OrderResponseSuccessType>(`api/v2_1/orders/${req.query.order}`)
    res.end(JSON.stringify({...response.data}))
}

export default order

export type OrderResponseSuccessType = {
    orders: Array<OrdersResponseType>
    status: OrderStatusType
}
type OrdersResponseType = {
    orderId: string
    orderCreateDate: string
    notifyUrl: string
    customerIp: string
    merchantPosId: string
    description: string
    currencyCode: string
    totalAmount: string
    status: string
    products: Array<OrderProductsType>
}
type OrderStatusType = {
    statusCode: string
    statusDesc: string
}