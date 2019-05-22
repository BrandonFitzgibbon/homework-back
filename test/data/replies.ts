import moment from 'moment'

export const replies = [{
    _id: '100',
    name: 'bob',
    content: "hello, world",
    target_id: '1',
    dateTime: moment(),
    city: 'Toronto',
    lat: 43,
    long: -79,
    temperature: 9
},{
    _id: '1',
    name: 'bob',
    content: "hello, world",
    target_id: "",
    dateTime: moment(),
    city: 'Toronto',
    lat: 43,
    long: -79,
    temperature: 9
}]