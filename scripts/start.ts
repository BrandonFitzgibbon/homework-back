import createApp from '../src/app'
import MongoDataService from '../src/data/mongo';
import { IEntry, IReply } from '../src/interfaces/interfaces';

const mongoEntryService = new MongoDataService<IEntry>("entries")
const mongoReplyService = new MongoDataService<IReply>("entries")
createApp(mongoEntryService, mongoReplyService)