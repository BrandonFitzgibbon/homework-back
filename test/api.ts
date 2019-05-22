import chai from 'chai'
import chaiHttp from 'chai-http'
import createApp from '../src/app'
import entries from './requests/entries'
import health from './requests/health'
import replies from './requests/replies'

chai.should()
chai.use(chaiHttp)

describe('can start server', () => {
    it ('creates application properly', () => {
        const app = createApp(undefined, undefined, undefined, undefined)
        app.should.not.be.eql(undefined)
    })
})

describe('api health request', () => {
    health.forEach(request => {
        it(request.description, () => {
            return chai.request(request.app)[request.method](request.path)
            .send()
            .then(result => {
                result.status.should.eql(200)
            })
        })
    })
})

describe('api entry requests', () => {
    entries.forEach(entry => {
        it(entry.description, () => {
            return chai.request(entry.app)[entry.method](entry.path)
            .send(entry.requestBody)
            .then(result => {
                if (entry.writeOnly) {
                    entry.expectedResponse.body = {
                        dateTime: result.body.dateTime,
                        ...entry.expectedResponse.body
                    }
                }
                result.status.should.eql(entry.expectedResponse.code)
                result.body.should.eql(entry.expectedResponse.body)
            })
        })
    })
})

describe('api reply requests', () => {
    replies.forEach(reply => {
        it(reply.description, () => {
            return chai.request(reply.app)[reply.method](reply.path)
            .send(reply.requestBody)
            .then(result => {
                if (reply.writeOnly) {
                    reply.expectedResponse.body = {
                        ...reply.expectedResponse.body,
                        dateTime: result.body.dateTime,
                        target_id: reply.pathId,
                    } as any
                }
                result.status.should.eql(reply.expectedResponse.code)
                result.body.should.eql(reply.expectedResponse.body)
            })
        })
    })
})