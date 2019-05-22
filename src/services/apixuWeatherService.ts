import request from 'request-promise-native'
import { IEntry, IWeatherService } from '../interfaces/interfaces'

export default class ApixuWeatherService implements IWeatherService {
    private key?: string

    constructor(key?: string) {
        if (key) {
            this.key = key
        }
    }

    public getWeatherDetails =  async (lat: number, long: number) : Promise<[Error?, number?]> => {
        if (this.key && lat && long) {
            const res = await request("https://api.apixu.com/v1/current.json?key=" + this.key + "&q=" + lat + "," + long)
            const json = JSON.parse(res)
            if (json.current && json.current.temp_c) {
                return [undefined, json.current.temp_c]
            }
        }
        return [new Error("Can't fetch weather data"), undefined]
    }
}