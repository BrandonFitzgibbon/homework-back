import { Request, Response } from 'express'

export const operations = {
    health: function(req: Request, res: Response) {
        res.sendStatus(200)
    },
    postEntry: function(req: Request, res: Response) {
        res.send(req.body)
    }
}