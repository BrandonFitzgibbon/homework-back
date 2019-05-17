import { Request, Response } from 'express'

export const operations = {
    postEntry: function(req: Request, res: Response) {
        res.send(req.body)
    }
}