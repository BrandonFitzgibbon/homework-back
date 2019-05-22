import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { initialize } from 'express-openapi'
import { renderDoc } from './doc/index'
import { IDataService, IEntry, IPlaceService, IReply, IWeatherService } from './interfaces/interfaces'
import { operations } from './operations'

dotenv.config()

const createApp = (entryService: IDataService<IEntry>, 
    replyService: IDataService<IReply>, 
    placeService: IPlaceService,
    weatherService: IWeatherService,
    port?: number) : Express.Application => {
    const app = express()
    app.use(bodyParser.json())
    app.use(cors())

    app.use((req, res, next) => {
        req.entryService = entryService
        req.replyService = replyService
        req.placeService = placeService
        req.weatherService = weatherService
        next()
    })

    const framework = initialize({
        app,
        apiDoc: './spec/spec.yaml',
        errorMiddleware(err, req, res, next) {
            res.status(err.status).send({errors: err.errors})
            next()
        },
        operations
    })

    app.use('/spec', (req, res) => {
        res.send(framework.apiDoc)
    })

    app.use('/docs', renderDoc)

    app.listen(port || 8001)

    return app
}

export default createApp