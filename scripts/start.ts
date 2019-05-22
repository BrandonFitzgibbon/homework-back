import createApp from '../src/app'
import MongoDataService from '../src/data/mongo';
import { IEntry, IReply } from '../src/interfaces/interfaces';
import ApixuWeatherService from '../src/services/apixuWeatherService';
import GooglePlaceService from '../src/services/googleMaps';

const mongoEntryService = new MongoDataService<IEntry>("entries")
const mongoReplyService = new MongoDataService<IReply>("entries")
const googlePlaceService = new GooglePlaceService(process.env.GOOGLE_MAPS_API_KEY)
const weatherService = new ApixuWeatherService(process.env.WEATHER_API_KEY)

createApp(mongoEntryService, mongoReplyService, googlePlaceService, weatherService)