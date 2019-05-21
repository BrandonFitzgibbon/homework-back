import { Request, Response } from 'express'
import timeStamper from './services/timeStamper'

const readyCheck = async (req: Request, res: Response, readyFunction: (req: Request, res: Response) => Promise<void>) => {
    const [ready, error] = await req.entryService.ready
    if (ready) {
        await readyFunction(req, res)
    } else {
        res.status(503).send({errors: [
            {
                errorCode: "503",
                location: "data service",
                message: "data service isn't ready",
                path: ""
            }
        ]})
    }
}

const getEntries = async (req: Request, res: Response) => {
    const [error, result] = await req.entryService.getItems(req.query)
    if (result) {
        res.send(timeStamper.convertMomentToStamp(result))
    } else {
        res.status(500).send({errors: [
            {
                errorCode: "500",
                location: "get entries",
                message: "something went wrong",
                path: ""
            }
        ]})
    }
}

const postEntries = async (req: Request, res: Response) => {
    const [error, result] = await req.entryService.newItems(timeStamper.stampObject(req.body))
    if (result) {
        res.send(timeStamper.convertMomentToStamp(result))
    } else {
        res.status(500).send({errors: [
            {
                errorCode: "500",
                location: "get entries",
                message: "something went wrong",
                path: ""
            }
        ]})
    }
}

export const operations = {
    health(req: Request, res: Response) {
        res.sendStatus(200)
    },
    getEntries: async (req: Request, res: Response) => {
        await readyCheck(req, res, getEntries)
    },
    postEntries: async (req: Request, res: Response) => {
        await readyCheck(req, res, postEntries)
    }
}