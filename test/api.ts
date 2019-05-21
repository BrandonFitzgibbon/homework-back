import chai from 'chai'
import chaiHttp from 'chai-http'
import createApp from '../src/app'
import { entries as entriesData } from './data/entries'
import MockDataService from './mocks/dataServiceMock';
import entries from './requests/entries'
import health from './requests/health'

chai.should()
chai.use(chaiHttp)

describe('can start server', () => {
    it ('creates application properly', () => {
        const app = createApp(new MockDataService(entriesData, true))
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
                    entry.expectedResponse.body[0] = {
                        dateTime: result.body[0].dateTime,
                        ...entry.expectedResponse.body[0]
                    }
                }
                result.status.should.eql(entry.expectedResponse.code)
                result.body.should.eql(entry.expectedResponse.body)
            })
        })
    })
})