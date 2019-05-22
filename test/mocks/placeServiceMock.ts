import { ILocationDetails, IPlaceService } from '../../src/interfaces/interfaces'

export default class MockPlaceService implements IPlaceService {
    private forceError: boolean = false

    constructor(forceError?: boolean) {
        if (forceError) {
            this.forceError = forceError
        }
    }

    public getLocationDetails = async (location: string) : Promise<[Error?, ILocationDetails?]> => {
        if (this.forceError) {
            return [new Error("location undefined"), undefined]
        }
        if (location) {
            return [ undefined, { 
                city: 'Toronto',
                lat: 43.653226,
                long: -79.3831843 
            }]
        } else {
            return [new Error("location undefined"), undefined]
        }
    }
}