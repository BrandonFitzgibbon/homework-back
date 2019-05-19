import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/app'
import entries from './requests/entries'
import health from './requests/health'

chai.should()
chai.use(chaiHttp)

describe('api health request', () => {
    health.forEach(request => {
        it(request.description, () => {
            return chai.request(app)[request.method](request.path)
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
            return chai.request(app)[entry.method](entry.path)
            .send(entry.requestBody)
            .then(result => {
                result.status.should.eql(entry.expectedResponse.code)
                result.body.should.eql(entry.expectedResponse.body)
            })
        })
    })
})