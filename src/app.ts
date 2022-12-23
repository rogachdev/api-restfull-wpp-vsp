
import { error } from 'console'
import express, { Request, Response } from 'express'
// import { resolve } from 'path'

import Sender from './sender'
const sender = new Sender()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/status', (req: Request, res: Response) => {
    return res.send({
        qr_code: sender.QrCOde,
        connected: sender.isConected
})
})


app.post('/send', async (req: Request, res: Response) => {
    const { number, message } = req.body
    try {
        // validando e tratando o numero do whatsapp
        await sender.sendText(number, message)
            return res.status(200).json()
    } catch (error) {
        console.error('error', error)
        res.status(500).json({status: 'error', message: error})
    }
})

app.post('/sendFile', async (req: Request, res: Response) => {
    const { number, filePath, options } = req.body
    try {
        await sender.sendFile(number, filePath, options)
        return res.status(200).json()
    } catch (erro) {
        console.error('error', erro)
        return res.status(500).json({ status: 'error', message: error })
    }
})

app.listen(5000, () => {
    console.log('server started')
})