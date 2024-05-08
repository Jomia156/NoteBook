import errorHandlerController from "../errorHendlers/errorHandler.Controller";
import { MongoClient } from "mongodb";
import { AppConfig } from "../config";
import { generateID } from "../components/generator";
import { TEventData, TEventDataForCreated, TListType } from "../types";
import CustomError from "../components/CustomError";
import logger from "../components/logger";

const mgClient = new MongoClient(AppConfig.mongoURL)

export class EventController {
    static async create(userId: string, eventData: TEventDataForCreated): Promise<void> {
        return await errorHandlerController(async () => {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const newEvent = {
                id: generateID(),
                userId: userId,
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

    static async remove(userId: string, eventId: string): Promise<void> {
        return await errorHandlerController(async () => {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const eventData = await db.collection("Events").findOne({ id: eventId })
            if (!eventData) {
                logger.debug("EventController.remove -> Event don`t found")
                throw new CustomError("DATA_DONT_FOUND", 404, "Event don`t found")
            }

            await db.collection("Events").deleteOne({ id: eventId })

            mgClient.close()
            logger.info("EventController.remove -> OK")
        })
    }

    static async chamgeData(eventId: string, newEventData: TEventData): Promise<void> {
        return await errorHandlerController(async () => {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const eventData = await db.collection("Events").findOne({ id: eventId })
            if (!eventData) {
                logger.debug("EventController.chamgeData -> Event don`t found")
                throw new CustomError("DATA_DONT_FOUND", 404, "Event don`t found")
            }

            await db.collection("Events").updateOne({ _id: eventData._id }, newEventData)

            mgClient.close()
            logger.info("EventController.chamgeData -> OK")
        })
    }

    static async getData(eventId: string): Promise<TEventData> {
        return await errorHandlerController(async () => {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const eventData = await db.collection("Events").findOne({ id: eventId })
            if (!eventData) {
                logger.debug("EventController.getData -> Event don`t found")
                throw new CustomError("DATA_DONT_FOUND", 404, "Event don`t found")
            }

            mgClient.close()
            logger.info("EventController.getData -> OK")
            return eventData
        })
    }


    static async getList(eventId:string, listType:TListType) {
        return await errorHandlerController(async ()=>{
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const eventData = await db.collection("Events").findOne({ id: eventId })
            if (!eventData) {
                logger.debug("EventController.getList -> Event don`t found")
                throw new CustomError("DATA_DONT_FOUND", 404, "Event don`t found")
            }

            mgClient.close()
            logger.info("EventController.getList -> OK")
            return eventData[listType]
        })
    }


}