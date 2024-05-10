import errorHandlerController from "../errorHendlers/errorHandler.Controller";
import { MongoClient } from "mongodb";
import { AppConfig } from "../config";
import { generateID } from "../components/generator";
import { TEventData, TEventDataForCreated, TListType } from "../types";
import CustomError from "../components/CustomError";
import logger from "../components/logger";

const mgClient = new MongoClient(AppConfig.mongoURL)

export class EventController {
    static async create(ownerId: string, eventData: TEventDataForCreated): Promise<void> {
        return await errorHandlerController(async () => {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const newEvent = {
                id: generateID(),
                ownerId: ownerId,
                title: eventData.title,
                description: eventData.decription,
                date: eventData.date,
                time: eventData.time,
                geoposition: eventData.geoposition,
                avatar: null
            }

            await db.collection("Events").insertOne(newEvent)
            mgClient.close()
            logger.info("EventController.create -> OK")
        })
    }

    static async remove(ownerId: string, eventId: string): Promise<void> {
        return await errorHandlerController(async () => {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const eventData = await db.collection("Events").findOne({ id: eventId })
            if (!eventData) {
                mgClient.close()
                logger.debug("EventController.remove -> Event don`t found")
                throw new CustomError("DATA_DONT_FOUND", 404, "Event don`t found")
            }
            if (eventData.ownerId != ownerId) {
                let message = "Forbidden"
                mgClient.close()
                logger.debug(message)
                throw new CustomError("FORBIDDEN", 403, message)
            }

            await db.collection("Events").deleteOne({ id: eventId })

            mgClient.close()
            logger.info("EventController.remove -> OK")
        })
    }

    static async changeData(ownerId:string, eventId: string, newEventData: TEventData): Promise<void> {
        return await errorHandlerController(async () => {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const eventData = await db.collection("Events").findOne({ id: eventId })
            if (!eventData) {
                mgClient.close()
                logger.debug("EventController.chamgeData -> Event don`t found")
                throw new CustomError("DATA_DONT_FOUND", 404, "Event don`t found")
            }
            if (eventData.ownerId != ownerId) {
                let message = "Forbidden"
                mgClient.close()
                logger.debug(message)
                throw new CustomError("FORBIDDEN", 403, message)
            }
            await db.collection("Events").updateOne({ _id: eventData._id }, newEventData)

            mgClient.close()
            logger.info("EventController.chamgeData -> OK")
        })
    }

    static async getData(ownerId:string, eventId: string): Promise<TEventData> {
        return await errorHandlerController(async () => {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const eventData = await db.collection("Events").findOne({ id: eventId })
            if (!eventData) {
                mgClient.close()
                logger.debug("EventController.getData -> Event don`t found")
                throw new CustomError("DATA_DONT_FOUND", 404, "Event don`t found")
            }
            if (!ownerId == eventData.ownerId) {
                mgClient.close()
                logger.debug("NoteController.removeById -> FORIBBEN", 403, "There is no access")
                throw new CustomError("FORIBBEN", 403, "There is no access")
            }
            mgClient.close()
            logger.info("EventController.getData -> OK")
            return eventData
        })
    }


    static async getList(ownerId:string, eventId:string, listType:TListType) {
        return await errorHandlerController(async ()=>{
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const eventData = await db.collection("Events").findOne({ id: eventId })
            if (!eventData) {
                mgClient.close()
                logger.debug("EventController.getList -> Event don`t found")
                throw new CustomError("DATA_DONT_FOUND", 404, "Event don`t found")
            }
            if (eventData.ownerId != ownerId) {
                let message = "Forbidden"
                mgClient.close()
                logger.debug(message)
                throw new CustomError("FORBIDDEN", 403, message)
            }

            mgClient.close()
            logger.info("EventController.getList -> OK")
            return eventData[listType]
        })
    }


}