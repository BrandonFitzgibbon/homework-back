import createServer from '../../src/app'
import MockDataService from '../mocks/dataServiceMock';

const mockDataService = new MockDataService([], true)
const app = createServer(mockDataService, undefined, 9100)

const health = [
    {
        app,
        description: 'should return ok',
        method: 'get',
        path: '/',
        expectedResponse: {
            code: 200
        }
    }
]

export default health