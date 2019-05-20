import createApp from '../src/app'
import MongoDataService from '../src/data/mongo';
import { IEntry } from '../src/interfaces/interfaces';

const mongoEntryService = new MongoDataService<IEntry>("entries")
createApp(mongoEntryService)