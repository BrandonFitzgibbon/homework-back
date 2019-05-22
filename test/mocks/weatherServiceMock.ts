import { IWeatherService } from '../../src/interfaces/interfaces'

export default class MockWeatherService implements IWeatherService {
    private temperature
    private forceError = false

    constructor(temperature?: number, forceError? : boolean) {
        if (forceError) {
            this.forceError = forceError
        }
        this.temperature = temperature || 17
    }

    public getWeatherDetails = async (lat: number, long: number) : Promise<[Error?, number?]> => {
        if (this.forceError) {
            return [new Error("long and long undefined"), undefined]
        }
        if (lat && long) {
            return [undefined, this.temperature]
        } else {
            return [new Error("long and long undefined"), undefined]
        }
    }

}