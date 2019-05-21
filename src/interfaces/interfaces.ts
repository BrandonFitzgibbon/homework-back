import { Moment } from 'moment'

export interface IDataService<T extends IDataItem> {
    ready: Promise<[boolean, Error?]>
    getItems:(query: any) => Promise<[Error?, T[]?]>
    newItems:(item: T[]) => Promise<[Error?, T[]?]>
    getItem:(id: string) => Promise<[Error?, T?]>
}

export interface IDataItem {
    _id: string
}

export interface IEntry extends IDataItem {
    content: string,
    name: string
    dateTime: Moment
}

export interface IReply extends IEntry {
    target_id: string
}

/* tslint:disable:interface-name*/
declare global {
    namespace Express {
        interface Request {
            entryService: IDataService<IEntry>
            replyService: IDataService<IReply>
        }
    }
}