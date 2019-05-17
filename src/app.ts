import express from 'express'
import { initialize } from 'express-openapi'
import { operations } from './operations'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
app.use(bodyParser.json())
app.use(cors())

initialize({
    app,
    apiDoc: './spec/spec.yaml',
    errorMiddleware: function(err, req, res, next) {
        res.status(err.status).send({errors: err.errors})
        next()
    },
    operations: operations
})

app.listen(8001)

export default app