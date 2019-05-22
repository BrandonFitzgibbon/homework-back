import { Request, Response } from 'express'
import moment = require('moment');
import { IDataService, IEntry } from './interfaces/interfaces';
import timeStamper from './services/timeStamper'

const readyCheck = async (req: Request, res: Response, service: IDataService<any>, next: (req: Request, res: Response) => Promise<void>, inject: boolean = false) => {
    const [ready, error] = await service.ready
    if (ready) {
        if (inject) {
            await injectLocation(req, res, next)
        } else {
            await next(req, res)
        }
    } else {
        res.status(503).send({errors: [
            {
                errorCode: "503",
                location: "data service",
                message: "data service isn't ready",
                path: ""
            }
        ]})
    }
}

const injectLocation = async (req: Request, res: Response, next: (req: Request, res: Response) => Promise<void>) => {
    const [error, locationDetails] = await req.placeService.getLocationDetails(req.body.city)
    if (locationDetails) {
        req.body = {
            ...req.body,
            ...locationDetails
        }
        injectWeather(req, res, next)
    } else {
        res.status(404).send({errors: [
            {
                errorCode: "404",
                location: "location service",
                message: "location not found",
                path: req.body.city
            }
        ]})
    }
}

const injectWeather = async (req: Request, res: Response, next: (req: Request, res: Response) => Promise<void>) => {
    const [err, weatherDetails] = await req.weatherService.getWeatherDetails(req.body.lat, req.body.long)
    if (weatherDetails) {
        req.body = {
            ...req.body,
            temperature: weatherDetails
        }
        next(req, res)
    } else {
        res.status(404).send({errors: [
            {
                errorCode: "404",
                location: "weather service",
                message: "weather data not found",
                path: req.body.city
            }
        ]})
    }
}

// gets entries that don't have a target_id are top level and not replies
const getEntries = async (req: Request, res: Response) => {
    const [error, result] = await req.entryService.getItems({
        ...req.query,
        target_id: null
    })
    if (result) {
        res.send(timeStamper.convertMomentToStamp(result))
    } else {
        res.status(500).send({errors: [
            {
                errorCode: "500",
                location: "get entries",
                message: "something went wrong",
                path: ""
            }
        ]})
    }
}

const postEntry = async (req: Request, res: Response) => {
    const [error, result] = await req.entryService.newItem(timeStamper.stampObject(req.body))
    if (result) {
        res.send(timeStamper.convertMomentToStamp(result))
    } else {
        res.status(500).send({errors: [
            {
                errorCode: "500",
                location: "post entry",
                message: "something went wrong",
                path: ""
            }
        ]})
    }
}

const getEntry = async (req: Request, res: Response) => {
    const [error, result] = await req.entryService.getItem(req.params.id)
    if (result) {
        res.send(timeStamper.convertMomentToStamp(result))
    } else if (!error && !result) {
        res.status(404).send({errors: [
            {
                errorCode: "404",
                location: "get entry",
                message: "not found",
                path: "id: " + req.params.id
            }
        ]})
    } else {
        res.status(500).send({errors: [
            {
                errorCode: "500",
                location: "get entry",
                message: "something went wrong",
                path: ""
            }
        ]})
    }
}

const getReplies = async (req: Request, res: Response) => {
    const [itemError, item] = await req.replyService.getItem(req.params.id)
    if (!item && !itemError) {
        res.status(404).send({errors: [
            {
                errorCode: "404",
                location: "get entry",
                message: "not found",
                path: "id: " + req.params.id
            }
        ]})
        return
    }
    const [error, result] = await req.replyService.getItems({
        target_id: req.params.id
    })
    if (result) {
        res.send(timeStamper.convertMomentToStamp(result))
    } else {
        res.status(500).send({errors: [
            {
                errorCode: "500",
                location: "get replies",
                message: "something went wrong",
                path: ""
            }
        ]})
    }
}

const postReply = async (req: Request, res: Response) => {
    const [itemError, item] = await req.replyService.getItem(req.params.id)
    if (!item && !itemError) {
        res.status(404).send({errors: [
            {
                errorCode: "404",
                location: "get entry",
                message: "not found",
                path: "id: " + req.params.id
            }
        ]})
        return
    }
    const [error, result] = await req.replyService.newItem(timeStamper.stampObject({
        ...req.body,
        target_id: req.params.id
    }))
    if (result) {
        res.send(timeStamper.convertMomentToStamp(result))
    } else {
        res.status(500).send({errors: [
            {
                errorCode: "500",
                location: "post reply",
                message: "something went wrong",
                path: ""
            }
        ]})
    }
}

export const operations = {
    health(req: Request, res: Response) {
        res.sendStatus(200)
    },
    getEntries: async (req: Request, res: Response) => {
        await readyCheck(req, res, req.entryService, getEntries)
    },
    postEntry: async (req: Request, res: Response) => {
        await readyCheck(req, res, req.entryService, postEntry, true)
    },
    getEntry: async (req: Request, res: Response) => {
        await readyCheck(req, res, req.entryService, getEntry)
    },
    getReplies: async (req: Request, res: Response) => {
        await readyCheck(req, res, req.replyService, getReplies)
    },
    postReply: async (req: Request, res: Response) => {
        await readyCheck(req, res, req.replyService, postReply, true)
    }
}