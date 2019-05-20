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

    public newItems = async (items: T[]) : Promise<[Error?, T[]?]> => {
        if (this.forceError) {
            return [new Error("something went wrong")]
        } else {
            this.items.forEach(item => [
                this.items.push(item)
            ])
            return [undefined, items]
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