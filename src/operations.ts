import { Request, Response } from 'express'

export const operations = {
    health(req: Request, res: Response) {
        res.sendStatus(200)
    },
    postEntry(req: Request, res: Response) {
        res.send(req.body)
    }
}