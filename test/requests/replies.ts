import createServer from '../../src/app'
import { replies as repliesData } from '../data/replies'
import MockDataService from '../mocks/dataServiceMock';
import MockPlaceService from '../mocks/placeServiceMock';
import MockWeatherService from '../mocks/weatherServiceMock';

const temperature = 22
const placeServiceMock = new MockPlaceService()
const weatherService = new MockWeatherService(temperature)
const readyMockDataService = new MockDataService(repliesData, true)
const readyForcedErrorsMockDataService = new MockDataService(repliesData, true, true)
const readyApp = createServer( undefined, readyMockDataService, placeServiceMock, weatherService, 9200)
const forcedErrorsApp = createServer(undefined, readyForcedErrorsMockDataService, placeServiceMock, weatherService, 9202)
const replies = [
    {
        app: readyApp,
        description: 'should return replies',
        method: 'get',
        path: '/entries/1/replies',
        expectedResponse: {
            code: 200,
            body: repliesData
        }
    },
    {
        app: forcedErrorsApp,
        description: 'should return error getting reply',
        method: 'get',
        path: '/entries/1/replies',
        expectedResponse: {
            code: 500,
            body: { errors: [
                {
                    errorCode: "500",
                    location: "get replies",
                    message: "something went wrong",
                    path: ""
                }
            ]}
        }
    },
    {
        app: readyApp,
        description: 'should return not found',
        method: 'get',
        path: '/entries/2/replies',
        expectedResponse: {
            code: 404,
            body: { errors: [
                {
                    errorCode: "404",
                    location: "get entry",
                    message: "not found",
                    path: "id: 2"
                }
            ]}
        }
    },
    {
        app: readyApp,
        description: 'should post reply',
        method: 'post',
        path: '/entries/1/replies',
        pathId: '1',
        requestBody: {
            "content": "even more replies",
            "name": "Marge",
            "city": "toronto"
        },
        writeOnly: true,
        expectedResponse: {
            code: 200,
            body: {
                "content": "even more replies",
                "name": "Marge",
                city: 'Toronto',
                lat: 43.653226,
                long: -79.3831843,
                temperature
            }
        }
    },
    {
        app: readyApp,
        description: 'should return not found',
        method: 'post',
        path: '/entries/2/replies',
        pathId: '1',
        requestBody: {
            "content": "even more replies",
            "name": "Marge",
            "city": "toronto"
        },
        expectedResponse: {
            code: 404,
            body: { errors: [
                {
                    errorCode: "404",
                    location: "get entry",
                    message: "not found",
                    path: "id: 2"
                }
            ]}
        }
    },
    {
        app: forcedErrorsApp,
        description: 'should return error posting reply',
        method: 'post',
        path: '/entries/1/replies',
        requestBody: {
            "content": "even more replies",
            "name": "Marge",
            "city": "toronto"
        },
        expectedResponse: {
            code: 500,
            body: { errors: [
                {
                    errorCode: "500",
                    location: "post reply",
                    message: "something went wrong",
                    path: ""
                }
            ]}
        }
    }
]

export default replies