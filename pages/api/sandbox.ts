import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";

interface SandBoxNextApiResponse extends NextApiRequest{
    query: {
        token: string
    }
}

const sandBoxOrder = (req: SandBoxNextApiResponse, res: NextApiResponse) =>{
    res.statusCode = 200
    const order : OrderType = {
        notifyUrl: "http://ac3c-2a01-117f-4107-2200-10f4-abe8-1abb-22df.ngrok.io/api/notify",
        customerIp: "127.0.0.1",
        merchantPosId: "430756",
        description: "RTV market",
        currencyCode: "PLN",
        totalAmount: "21000",
        buyer: {
            email: "nicepk.by@gmail.com",
            phone: "654111654",
            firstName: "John",
            lastName: "Doe",
            language: "pl"
        },
        products: [
            {
                name: "Wireless Mouse for Laptop",
                unitPrice: "15000",
                quantity: "1"
            },
            {
                name: "HDMI cable",
                unitPrice: "6000",
                quantity: "1"
            }
        ]
    }
    const instance = axios.create({
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${req.query.token}`,
        },
        maxRedirects: 0,
        baseURL: 'https://secure.snd.payu.com/'
    })
    instance.post(`api/v2_1/orders`, {...order}).then(response => res.end({response}))
        .catch((e : SandBoxOrderErrorType)=> {
            res.end(JSON.stringify({...e.response.data}))
        })
}

export default sandBoxOrder

type OrderType = {
    notifyUrl: string
    customerIp: string
    merchantPosId: string
    description: string
    currencyCode: string
    totalAmount: string
    buyer: OrderBuyerType
    products: Array<OrderProductsType>
}
type OrderBuyerType = {
    email: string
    phone: string
    firstName: string
    lastName: string
    language: string
}
export type OrderProductsType = {
    name: string
    unitPrice: string
    quantity: string
}
type SandBoxOrderErrorType = {
    response: {
        data: SandBoxOrderSuccessType
    }
}
export type SandBoxOrderSuccessType = {
    status: { statusCode: string }
    redirectUri: string
    orderId: string
}