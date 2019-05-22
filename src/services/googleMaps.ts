import googlemaps from '@google/maps'
import { ILocationDetails, IPlaceService } from '../interfaces/interfaces'

export default class GooglePlaceService implements IPlaceService {
    private apiKey?: string
    private client?: googlemaps.GoogleMapsClient

    constructor(key?: string) {
        this.apiKey = key
        if (this.apiKey) {
            this.client = googlemaps.createClient({
                key: this.apiKey,
                Promise
            })
        }
    }

    public getLocationDetails = async (location: string) : Promise<[Error?, ILocationDetails?]> => {
        if (this.client) {
            const query = await this.client.findPlace({
                input: location,
                inputtype: 'textquery',
                locationbias: 'ipbias'
            }).asPromise()
            if (query && query.status === 200 && query.json && query.json.candidates) {
                const closestCandidate = query.json.candidates[0]
                if (closestCandidate.place_id) {
                    const place = await this.client.place({
                        placeid: closestCandidate.place_id
                    }).asPromise()
                    if (place && place.status === 200 && place.json && place.json.result) {
                        return [ undefined, {
                            city: place.json.result.name,
                            lat: place.json.result.geometry.location.lat,
                            long: place.json.result.geometry.location.lng
                        }]
                    }
                }
            }
        }
        return [new Error("Couldn't fetch location data"), undefined]
    }
}