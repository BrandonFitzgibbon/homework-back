import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/app'
import entries from './requests/entries'

chai.should()
chai.use(chaiHttp)

describe('api request', () => {
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