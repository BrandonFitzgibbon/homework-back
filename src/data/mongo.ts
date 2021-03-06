import { MongoClient, MongoError, ObjectId, ObjectID } from 'mongodb'
import { IDataItem, IDataService } from '../interfaces/interfaces';
import timeStamper from '../services/timeStamper';

export default class MongoDataService<T extends IDataItem> implements IDataService<T> {    
    public ready: Promise<[boolean, Error?]>
    private url = process.env.MONGO_DB_URI
    private username = process.env.MONGO_DB_USER
    private password = process.env.MONGO_DB_PASS
    private database = process.env.MONGO_DB_NAME
    private collection?: string
    private client? : MongoClient

    constructor(collection: string) {
        this.collection = collection
        this.ready = this.connect()
    }

    public getItems = async (query: any) : Promise<[Error?, T[]?]> => {
        if (this.client && this.collection) {
            const db = this.client.db(this.database)
            let result 
            try {
                result = await db.collection(this.collection).find(query).toArray()
                return [undefined, timeStamper.convertStampToMoment(result)]
            } catch (err) {
                return [err]
            }
        } else {
            return [new Error("Service isn't ready")]
        }
    }

    public newItem = async (item: T) : Promise<[Error?, T?]> => {
        if (this.client && this.collection) {
            const db = this.client.db(this.database)
            let result 
            try {
                result = await db.collection(this.collection).insertOne(item)
                return [undefined, timeStamper.convertStampToMoment(result.ops[0])]
            } catch (err) {
                return [err]
            }
        } else {
            return [new Error("Service isn't ready")]
        }
    }

    public getItem = async (id: string) : Promise<[Error?, T?]> => {
        if (this.client && this.collection) {
            const db = this.client.db(this.database)
            let result 
            try {
                result = await db.collection(this.collection).findOne(new ObjectID(id))
                return [undefined, timeStamper.convertStampToMoment(result)]
            } catch (err) {
                return [err]
            }
        } else {
            return [new Error("Service isn't ready")]
        }
    }

    private connect = async () : Promise<[boolean, Error?]> => {
        return new Promise<[boolean, Error?]>((resolve) => {
            if (this.url && this.username && this.password && this.database && this.collection) {
                MongoClient.connect(this.url, {
                    useNewUrlParser: true,
                    auth: {
                        user: this.username,
                        password: this.password
                    }
                }, (error: MongoError, client: MongoClient) => {
                    if (!error) {
                        this.client = client
                        resolve([true, undefined])
                    } else {
                        resolve([false, error])
                    }
                })
            } else {
                resolve([false, new Error("Cannot establish connection")])
            }
        })
    }
}