import {NextApiRequest, NextApiResponse} from "next";
import {OrderProductsType} from "./sandbox";
//import '@jswork/next-md5';

interface NotifyNextApiResponse extends NextApiRequest{
    body: NotifyStatusType
    headers: {
        host: string
        'user-agent': string
        'content-length': string
        'content-type': string
        'openpayu-signature': string
        'x-forwarded-for': string
        'x-forwarded-proto': string
        'x-openpayu-signature': string
        'accept-encoding': string
    }

}

const notify = async (req: NotifyNextApiResponse, res: NextApiResponse) =>{
    if (req.method === 'POST') {
        res.statusCode = 200
       // const incoming_signature = req.headers["openpayu-signature"].split(';')[1].split('=')[1]
       // const concatenated = JSON.stringify(req.headers["openpayu-signature"]) + process.env.NEXT_PUBLIC_SANDBOX_MD5
       // const expected_signature = nx.md5(concatenated)
       // if(expected_signature == incoming_signature){
       //     res.end()
       // }else{
       //     res.end('Wrong signature')
       // }
        req.body
        res.end()
    }
}

export default notify

export type NotifyStatusType = {
    order: {
        orderId: string
        orderCreateDate: string
        notifyUrl: string
        customerIp: string
        merchantPosId: string
        description: string
        currencyCode: string,
        totalAmount: string
        status: string
        products: Array<OrderProductsType>
    },
    properties: Array<{ name: string, value: string }>
}