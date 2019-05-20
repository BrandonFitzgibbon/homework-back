import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { initialize } from 'express-openapi'
import MongoDataService from './data/mongo'
import { IEntry, IDataService } from './interfaces/interfaces'
import { operations } from './operations'

dotenv.config()

const createApp = (entryService: IDataService<IEntry>, port?: number) : Express.Application => {
    const app = express()
    app.use(bodyParser.json())
    app.use(cors())

    app.use((req, res, next) => {
        req.entryService = entryService
        next()
    })

    initialize({
        app,
        apiDoc: './spec/spec.yaml',
        errorMiddleware(err, req, res, next) {
            res.status(err.status).send({errors: err.errors})
            next()
        },
        operations
    })

    app.listen(port || 8001)

    return app
}

export default createApp