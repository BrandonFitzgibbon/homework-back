import moment, { isMoment } from 'moment'

const stampObject = (object: any) : any => {
    if (Array.isArray(object)) {
        return object.map(item => {
            return {
                ...item,
                dateTime: moment().toISOString()
            }
        })
    } else {
        return {
            ...object,
            dateTime: moment().toISOString()
        }
    }
}

const convertStampToMoment = (object: any) : any => {
    if (Array.isArray(object)) {
        return object.map(item => {
            Object.keys(item).forEach(property => {
                if (property === "dateTime") {
                    item[property] = moment(item[property])
                }
            })
            return item
        })
    } else {
        Object.keys(object).forEach(property => {
            if (property === "dateTime") {
                object[property] = moment(object[property])
            }
        })
        return object
    }
}

const convertMomentToStamp = (object: any) : any => {
    if (Array.isArray(object)) {
        return object.map(item => {
            Object.keys(item).forEach(property => {
                if (property === "dateTime") {
                    if (isMoment(item[property])) {
                        item[property] = item[property].toISOString()
                    }
                }
            })
            return item
        })
    } else {
        Object.keys(object).forEach(property => {
            if (property === "dateTime") {
                if (isMoment(object[property])) {
                    object[property] = object[property].toISOString()
                }
            }
        })
        return object
    }
}

const timeStamper = {
    stampObject,
    convertStampToMoment,
    convertMomentToStamp
}

export default timeStamper