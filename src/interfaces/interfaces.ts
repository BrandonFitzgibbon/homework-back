import { Moment } from 'moment'

export interface IDataService<T extends IDataItem> {
    ready: Promise<[boolean, Error?]>
    getItems:(query: any) => Promise<[Error?, T[]?]>
    newItems:(item: T[]) => Promise<[Error?, T[]?]>
}

export interface IDataItem {
    _id: string
}

export interface IEntry extends IDataItem {
    content: string,
    dateTime: Moment
}

/* tslint:disable:interface-name*/
declare global {
    namespace Express {
        interface Request {
            entryService: IDataService<IEntry>
        }
    }
}