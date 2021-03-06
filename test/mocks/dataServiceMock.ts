import { IDataItem, IDataService } from '../../src/interfaces/interfaces';

export default class MockDataService<T extends IDataItem> implements IDataService<T> {    
    public ready: Promise<[boolean, Error?]>
    private items: T[]
    private forceError?
    

    constructor(items: T[], readyOverride: boolean, forceError? : boolean) {
        this.ready = this.setReady(readyOverride)
        this.items = items
        this.forceError = forceError
    }

    public getItems = async (query: any) : Promise<[Error?, T[]?]> => {
        if (this.forceError) {
            return [new Error("something went wrong")]
        } else {
            return [undefined, this.items]
        }
    }

    public newItem = async (item: T) : Promise<[Error?, T?]> => {
        if (this.forceError) {
            return [new Error("something went wrong")]
        } else {
            this.items.push(item)
            return [undefined, item]
        }
    }

    public getItem = async (id: string) : Promise<[Error?, T?]> => {
        if (this.forceError) {
            return [new Error("something went wrong")]
        } else {
            return [undefined, this.items.find(i => i._id === id)]
        }
    }

    private setReady = (ready: boolean) : Promise<[boolean, Error?]> => {
        return new Promise((resolve, reject) => {
            if (ready) {
                resolve([ready])
            } else {
                resolve([false, new Error("not ready")])
            }
        })
    }
}