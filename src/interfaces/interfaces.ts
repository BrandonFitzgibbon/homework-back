import { Moment } from 'moment'

export interface IDataService<T extends IDataItem> {
    ready: Promise<[boolean, Error?]>
    getItems:(query: any) => Promise<[Error?, T[]?]>
    newItem:(item: T) => Promise<[Error?, T?]>
    getItem:(id: string) => Promise<[Error?, T?]>
}

export interface IDataItem {
    _id: string
}

export interface IEntry extends IDataItem {
    content: string
    name: string
    dateTime: Moment
    city: string
    lat: number
    long: number
    temperature: number
}

export interface IReply extends IEntry {
    target_id: string
}

export interface IPlaceService {
    getLocationDetails: (location: string) => Promise<[Error?, ILocationDetails?]>
}

export interface ILocationDetails {
    city: string,
    lat: number,
    long: number
}

export interface IWeatherService {
    getWeatherDetails: (lat: number, long: number) => Promise<[Error?, number?]>
}

/* tslint:disable:interface-name*/
declare global {
    namespace Express {
        interface Request {
            entryService: IDataService<IEntry>
            replyService: IDataService<IReply>
            placeService: IPlaceService
            weatherService: IWeatherService
        }
    }
}