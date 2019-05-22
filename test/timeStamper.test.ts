import chai from 'chai'
import moment = require('moment');
import timeStamper from '../src/services/timeStamper'
chai.should()

describe('time stamper stamps targets', () => {
    it('stamps objects', (done) => {
        const result = timeStamper.stampObject({
            id: '1',
            name: 'test'
        })
        result.should.haveOwnProperty("dateTime")
        result.dateTime.should.not.be.eql(undefined)
        done()
    })
    it('stamps array', (done) => {
        const result = timeStamper.stampObject([
            {
                id: '1',
                name: 'test'
            },
            {
                id: '2',
                name: 'test'
            }
        ])
        result.should.be.an("array")
        result.forEach(i => {
            i.should.haveOwnProperty("dateTime")
            i.dateTime.should.not.be.eql(undefined)
        })        
        done()
    })
    it('converts stamped object to moment', (done) => {
        const dateTime = moment()
        const obj = {
            id: '1',
            dateTime: dateTime.toISOString()
        }
        const convertedObj = timeStamper.convertStampToMoment(obj)
        moment.isMoment(convertedObj.dateTime).should.be.eql(true)
        convertedObj.dateTime.toISOString().should.be.eql(dateTime.toISOString())
        done()
    })
    it ('converts stamped object array stamps to moment', (done) => {
        const dateTime = moment()
        const obj = [
            {
                id: '1',
                dateTime: dateTime.toISOString()
            },
            {
                id: '2',
                dateTime: dateTime.toISOString()
            }
        ]
        const convertedObj = timeStamper.convertStampToMoment(obj)
        convertedObj.should.be.an("array")
        convertedObj.forEach(i => {
            moment.isMoment(i.dateTime).should.be.eql(true)
            i.dateTime.toISOString().should.be.eql(dateTime.toISOString())
        })
        done()
    })
    it ('converts objects with datetime moments to stamps', (done) => {
        const dateTime = moment()
        const obj = {
            id: '1',
            dateTime
        }
        const convertedObj = timeStamper.convertMomentToStamp(obj)
        convertedObj.dateTime.should.be.a("string")
        convertedObj.dateTime.should.be.eql(dateTime.toISOString())
        done()
    })
    it ('converts object arrays with datetime moments to stamps', (done) => {
        const dateTime = moment()
        const obj = [
            {
                id: '1',
                dateTime
            },
            {
                id: '2',
                dateTime
            }
        ]
        const convertedObj = timeStamper.convertMomentToStamp(obj)
        convertedObj.should.be.an("array")
        convertedObj.forEach(i => {
            i.dateTime.should.be.a("string")
            i.dateTime.should.be.eql(dateTime.toISOString())
        })
        done()
    })
    it ("doesn't mutate objects that have an invalid dateTime property", (done) => {
        const obj = {
            id: '1',
            dateTime: 'not a moment'
        }
        const convertedObj = timeStamper.convertMomentToStamp(obj)
        convertedObj.should.be.equal(obj)
        done()
    })
    it ("doesn't mutate objects in arrays that have an invalid dateTime property", (done) => {
        const obj = [
            {
                id: '1',
                dateTime: 'not a moment'
            },
            {
                id: '2',
                dateTime: 'not a moment'
            }
        ]
        const convertedObj = timeStamper.convertMomentToStamp(obj)
        convertedObj.should.be.eql(obj)
        done()
    })
})
