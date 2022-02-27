import {NextApiRequest, NextApiResponse} from "next";

const notify = async (req: NextApiRequest, res: NextApiResponse) =>{
    if (req.method === 'PUT') {
        res.statusCode = 200
        console.log('yraaaaaaaaaaaaaaaaaaaaaaaaa')
        console.log(req.body)
        res.end()
    } else {
        res.statusCode = 200
        console.log(req.method)
        res.end()
    }
}

export default notify