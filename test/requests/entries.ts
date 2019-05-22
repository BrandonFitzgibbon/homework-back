import createServer from '../../src/app'
import { entries as entriesData } from '../data/entries'
import MockDataService from '../mocks/dataServiceMock';
import MockPlaceService from '../mocks/placeServiceMock';
import MockWeatherService from '../mocks/weatherServiceMock';

const temperature = 27
const placeServiceMock = new MockPlaceService()
const errorPlaceServiceMock = new MockPlaceService(true)
const weatherService = new MockWeatherService(temperature)
const errorWeatherService = new MockWeatherService(temperature, true)
const readyMockDataService = new MockDataService(entriesData, true)
const readyForcedErrorsMockDataService = new MockDataService(entriesData, true, true)
const notReadyMockDataService = new MockDataService(entriesData, false)
const readyApp = createServer(readyMockDataService, undefined, placeServiceMock, weatherService, 9000)
const badPlaceServiceApp = createServer(readyMockDataService, undefined, errorPlaceServiceMock, weatherService, 9003)
const badWeatherServiceApp = createServer(readyMockDataService, undefined, placeServiceMock, errorWeatherService, 9004)
const forcedErrorsApp = createServer(readyForcedErrorsMockDataService, undefined, placeServiceMock, weatherService, 9002)
const notReadyApp = createServer(notReadyMockDataService, undefined, placeServiceMock, weatherService, 9001)
const entries = [
    {
        app: readyApp,
        description: 'should return entries',
        method: 'get',
        path: '/entries',
        expectedResponse: {
            code: 200,
            body: entriesData
        }
    },
    {
        app: forcedErrorsApp,
        description: 'should return error if service returns error getting entries',
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
        requestBody: {
            content: "hello, world",
            name: "bob",
            city: "Toronto"
        },
        writeOnly: true,
        expectedResponse: {
            code: 200,
            body: {
                content: "hello, world",
                name: "bob",
                city: 'Toronto',
                lat: 43.653226,
                long: -79.3831843,
                temperature
            }
        },
    },
    {
        app: notReadyApp,
        description: "should return 503 when data service isn't ready",
        method: 'post',
        path: '/entries',
        requestBody: {
            content: "hello, world",
            name: "bob",
            city: "Toronto"
        },
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
        description: 'should return error if service returns error posting entries',
        method: 'post',
        path: '/entries',
        requestBody: {
            content: "hello, world",
            name: "bob",
            city: "Toronto"
        },
        expectedResponse: {
            code: 500,
            body: {
                errors: [
                    {
                        errorCode: "500",
                        location: "post entry",
                        message: "something went wrong",
                        path: ""
                    }
                ]
            }
        }
    },
    {
        app: badWeatherServiceApp,
        description: 'should return error if weather service fails',
        method: 'post',
        path: '/entries',
        requestBody: {
            content: "hello, world",
            name: "bob",
            city: "Toronto"
        },
        expectedResponse: {
            code: 404,
            body: {
                errors: [
                    {
                        errorCode: "404",
                        location: "weather service",
                        message: "weather data not found",
                        path: "Toronto"
                    }
                ]
            }
        }
    },
    {
        app: badPlaceServiceApp,
        description: 'should return error if place service fails',
        method: 'post',
        path: '/entries',
        requestBody: {
            content: "hello, world",
            name: "bob",
            city: "Toronto"
        },
        expectedResponse: {
            code: 404,
            body: {
                errors: [
                    {
                        errorCode: "404",
                        location: "location service",
                        message: "location not found",
                        path: "Toronto"
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
        requestBody: {
            content: 1231,
            name: "bob",
            city: "Toronto"
        },
        expectedResponse: {
            code: 400,
            body: {
                errors: [
                    {
                        errorCode: "type.openapi.validation",
                        location: "body",
                        message: "should be string",
                        path: "content",
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
        requestBody: {
            id: 3,
            name: "bob",
            oranges: {
                color: 'orange'
            },
            city: "Toronto"
        },
        expectedResponse: {
            code: 400,
            body: {
                errors: [
                    {
                        errorCode: "required.openapi.validation",
                        location: "body",
                        message: "should have required property 'content'",
                        path: "content",
                    }
                ]
            }
        }
    },
    {
        app:readyApp,
        description: 'should return entry by id',
        method: 'get',
        path: '/entries/1',
        expectedResponse: {
            code: 200,
            body: entriesData.find(i => i._id === '1')
        }
    },
    {
        app:readyApp,
        description: 'should return entry by id',
        method: 'get',
        path: '/entries/9000',
        expectedResponse: {
            code: 404,
            body: {
                errors: [
                    {
                        errorCode: "404",
                        location: "get entry",
                        message: "not found",
                        path: "id: 9000"
                    }
                ]
            }
        }
    },
    {
        app:forcedErrorsApp,
        description: 'should return error getting entry by id',
        method: 'get',
        path: '/entries/1',
        expectedResponse: {
            code: 500,
            body: {
                errors: [
                    {
                        errorCode: "500",
                        location: "get entry",
                        message: "something went wrong",
                        path: ""
                    }
                ]
            }
        }
    }
]

export default entries