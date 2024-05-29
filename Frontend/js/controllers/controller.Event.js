import CustomError from "../components/customError.js";
import errorHandler from "../components/errorHendler_Controller.js"
import quertyString from "../components/quertyString.js";

export default class EventController {
    
    static async get(eventId) {
        return await errorHandler(async ()=>{
            const {statusCode, data, description} = await fetch("/api/events/"+eventId, {headers: {Authorization: window.localStorage.accessToken}}).then(data=>data.json())
            if (statusCode == 200) {
                return data
            }
            else {
                throw new CustomError(description)
            }
        })
    }

    static async create(eventData) {
        return await errorHandler(async ()=>{
            const {statusCode, data, description} = await fetch("/api/event", {method:"POST", headers: {Authorization:window.localStorage.accessToken}, body: JSON.stringify(eventData)}).then(data=>data.json())
            if (statusCode == 201) {
                return true
            }
            else {
                throw new CustomError(description)
            }
        })
    }

    static async changeData(newEventData) {
        return await errorHandler(async ()=>{
            const {statusCode, data, description} = await fetch("/api/event", {method:"PUT", headers:{Authorization:window.localStorage.accessToken}, body:JSON.stringify(newEventData)}).then(data=>data.json())
            if (statusCode == 201) {
                return true
            }
            else {
                throw new CustomError(description)
            }
        })
    }

    static async remove(eventId) {
        return await errorHandler(async ()=>{
            const {statusCode, data, description } = await fetch("/api/event/"+eventId, {method:"DELETE"}).then(data=>data.json())
            if (statusCode == 204) {
                return true
            }
            else {
                throw new CustomError(description)
            }
        })
    } 

    static async getForUser() {
        return await errorHandler(async ()=>{
            const {statusCode, data, description} = await fetch("/api/events1", {headers: {Authorization:window.localStorage.accessToken}}).then(data=>data.json())
            if (statusCode == 200) {
                return data
            }
            else {
                throw new CustomError(description)
            }
        })
    }

}