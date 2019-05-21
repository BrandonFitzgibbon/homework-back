import { Request, Response } from 'express'
import { IDataService } from './interfaces/interfaces';
import timeStamper from './services/timeStamper'

const readyCheck = async (req: Request, res: Response, service: IDataService<any>, readyFunction: (req: Request, res: Response) => Promise<void>) => {
    const [ready, error] = await service.ready
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

const getEntry = async (req: Request, res: Response) => {
    const [error, result] = await req.entryService.getItem(req.params.id)
    if (result) {
        res.send(timeStamper.convertMomentToStamp(result))
    } else if (!error && !result) {
        res.status(404).send({errors: [
            {
                errorCode: "404",
                location: "get entry",
                message: "not found",
                path: "id: " + req.params.id
            }
        ]})
    } else {
        res.status(500).send({errors: [
            {
                errorCode: "500",
                location: "get entry",
                message: "something went wrong",
                path: ""
            }
        ]})
    }
}

const getReplies = async (req: Request, res: Response) => {
    const [itemError, item] = await req.replyService.getItem(req.params.id)
    if (!item && !itemError) {
        res.status(404).send({errors: [
            {
                errorCode: "404",
                location: "get entry",
                message: "not found",
                path: "id: " + req.params.id
            }
        ]})
        return
    }
    const [error, result] = await req.replyService.getItems({
        target_id: req.params.id
    })
    if (result) {
        res.send(timeStamper.convertMomentToStamp(result))
    } else {
        res.status(500).send({errors: [
            {
                errorCode: "500",
                location: "get replies",
                message: "something went wrong",
                path: ""
            }
        ]})
    }
}

const postReply = async (req: Request, res: Response) => {
    const [itemError, item] = await req.replyService.getItem(req.params.id)
    if (!item && !itemError) {
        res.status(404).send({errors: [
            {
                errorCode: "404",
                location: "get entry",
                message: "not found",
                path: "id: " + req.params.id
            }
        ]})
        return
    }
    const [error, result] = await req.replyService.newItems(timeStamper.stampObject([{
        ...req.body,
        target_id: req.params.id
    }]))
    if (result) {
        res.send(timeStamper.convertMomentToStamp(result[0]))
    } else {
        res.status(500).send({errors: [
            {
                errorCode: "500",
                location: "post reply",
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
        await readyCheck(req, res, req.entryService, getEntries)
    },
    postEntries: async (req: Request, res: Response) => {
        await readyCheck(req, res, req.entryService, postEntries)
    },
    getEntry: async (req: Request, res: Response) => {
        await readyCheck(req, res, req.entryService, getEntry)
    },
    getReplies: async (req: Request, res: Response) => {
        await readyCheck(req, res, req.replyService, getReplies)
    },
    postReply: async (req: Request, res: Response) => {
        await readyCheck(req, res, req.replyService, postReply)
    }
}