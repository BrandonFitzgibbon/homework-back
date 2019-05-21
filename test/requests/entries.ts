import createServer from '../../src/app'
import { entries as entriesData } from '../data/entries'
import MockDataService from '../mocks/dataServiceMock';

const readyMockDataService = new MockDataService(entriesData, true)
const readyForcedErrorsMockDataService = new MockDataService(entriesData, true, true)
const notReadyMockDataService = new MockDataService(entriesData, false)
const readyApp = createServer(readyMockDataService, 9000)
const forcedErrorsApp = createServer(readyForcedErrorsMockDataService, 9002)
const notReadyApp = createServer(notReadyMockDataService, 9001)
const entries = [
    {
        app: readyApp,
        description: 'should return mock data',
        method: 'get',
        path: '/entries',
        expectedResponse: {
            code: 200,
            body: entriesData
        }
    },
    {
        app: forcedErrorsApp,
        description: 'should return error if service returns error',
        method: 'get',
        path: '/entries',
        expectedResponse: {
            code: 500,
            body: {
                errors: [
                    {
                        errorCode: "500",
                        location: "get entries",
                        message: "something went wrong",
                        path: ""
                    }
                ]
            }
        }
    },
    {
        app: notReadyApp,
        description: "should return 503 when data service isn't ready",
        method: 'get',
        path: '/entries',
        expectedResponse: {
            code: 503,
            body: {
                errors: [
                    {
                        errorCode: "503",
                        location: "data service",
                        message: "data service isn't ready",
                        path: ""
                    }
                ]
            }
        }
    },
    {
        app: readyApp,
        description: 'should return posted entries',
        method: 'post',
        path: '/entries',
        requestBody: [{
            content: "hello, world",
            name: "bob"
        }],
        writeOnly: true,
        expectedResponse: {
            code: 200,
            body: [{
                content: "hello, world",
                name: "bob",
            }]
        },
    },
    {
        app: notReadyApp,
        description: 'should return posted entries',
        method: 'post',
        path: '/entries',
        requestBody: [{
            content: "hello, world",
            name: "bob"
        }],
        expectedResponse: {
            code: 503,
            body: {
                errors: [
                    {
                        errorCode: "503",
                        location: "data service",
                        message: "data service isn't ready",
                        path: ""
                    }
                ]
            }
        }
    },
    {
        app: forcedErrorsApp,
        description: 'should return error if service returns error',
        method: 'post',
        path: '/entries',
        requestBody: [{
            content: "hello, world",
            name: "bob"
        }],
        expectedResponse: {
            code: 500,
            body: {
                errors: [
                    {
                        errorCode: "500",
                        location: "get entries",
                        message: "something went wrong",
                        path: ""
                    }
                ]
            }
        }
    },
    {
        app: readyApp,
        description: 'should return bad request error (number instead of string)',
        method: 'post',
        path: '/entries',
        requestBody: [{
            content: 1231,
            name: "bob"
        }],
        expectedResponse: {
            code: 400,
            body: {
                errors: [
                    {
                        errorCode: "type.openapi.validation",
                        location: "body",
                        message: "should be string",
                        path: "[0].content",
                    }
                ]
            }
        }
    },
    {
        app: readyApp,
        description: 'should return bad request error (missing required property)',
        method: 'post',
        path: '/entries',
        requestBody: [{
            id: 3,
            name: "bob",
            oranges: {
                color: 'orange'
            }
        }],
        expectedResponse: {
            code: 400,
            body: {
                errors: [
                    {
                        errorCode: "required.openapi.validation",
                        location: "body",
                        message: "should have required property 'content'",
                        path: "[0].content",
                    }
                ]
            }
        }
    }
]

export default entries