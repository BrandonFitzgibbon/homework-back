import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { initialize } from 'express-openapi'
import { operations } from './operations'

const app = express()
app.use(bodyParser.json())
app.use(cors())

initialize({
    app,
    apiDoc: './spec/spec.yaml',
    errorMiddleware(err, req, res, next) {
        res.status(err.status).send({errors: err.errors})
        next()
    },
    operations
})

app.listen(8001)

export default app