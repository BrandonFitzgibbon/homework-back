const entries = [
    {
        description: 'should return posted entries',
        method: 'post',
        path: '/entries',
        requestBody: {
            content: "hello, world"
        },
        expectedResponse: {
            code: 200,
            body: {
                content: "hello, world"
            }
        }
    },
    {
        description: 'should return bad request error (number instead of string)',
        method: 'post',
        path: '/entries',
        requestBody: {
            content: 33432
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
        description: 'should return bad request error (missing required property)',
        method: 'post',
        path: '/entries',
        requestBody: {
            id: 3,
            oranges: {
                color: 'orange'
            }
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
    }
]

export default entries