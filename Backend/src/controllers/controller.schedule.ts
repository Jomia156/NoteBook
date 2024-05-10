import logger from "../components/logger";
import CustomError from "../components/CustomError";
import { MongoClient, WithId, Document, FindCursor } from "mongodb";
import { AppConfig } from "../config";
import { generateID } from "../components/generator";
import { describe } from "node:test";
import { TDateScritg, TSchuduleData, TTask } from "../types";
import errorHandlerController from "../errorHendlers/errorHandler.Controller";
import { Colendar } from "../components/Colendar";


const mgClient = new MongoClient(AppConfig.mongoURL)

export class ScheduleController {
    static async get(userId: string, date: string = null, collection: "Users" | "Schedules" = "Users") {
        return await errorHandlerController(async () => {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            if (date) {
                const schedules = await db.collection("Users").findOne({ id: userId, schedules: }, { schedules: 1 })
                const colendar = new Colendar(schedules)
                colendar.getColendarFromMonth(date)

                mgClient.close()
                logger.info("ScheduleController.get -> OK")

                return colendar.getColendar()
            }
            else {
                const schedules = await db.collection("Users").findOne({ id: userId, schedules: }, { schedules: 1 })

                mgClient.close()
                logger.info("ScheduleController.get -> OK")
                return schedules
            }
        })
    }

    static async createTask(userId: string, scheduleData: TSchuduleData): Promise<void> {
        return await errorHandlerController(async () => {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const userData = await db.collection("Users").findOne({ id: userId })
            if (!userData) {
                const message = "User don`t found"
                mgClient.close()
                logger.debug("ScheduleController.createTask -> " + message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }

            const userSchedules = userData.schedules
            const colendar = new Colendar(userSchedules)
            colendar.appendTask(scheduleData.date, scheduleData.task)
            const newColendar = colendar.getColendar()

            await db.collection("Users").updateOne({ _id: userData._id }, { schedules: newColendar })


            mgClient.close()
            logger.info("ScheduleController.createTask -> OK")
        })
    }

    static async changeTask(userId: string, newTask: TTask): Promise<void> {
        return await errorHandlerController(async () => {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const userData = await db.collection("Users").findOne({ id: userId })
            if (!userData) {
                const message = "User don`t found"
                mgClient.close()
                logger.debug("ScheduleController.changeTask -> " + message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }

            const userSchedules = userData.schedules
            const colendar = new Colendar(userSchedules)
            colendar.uploadTask(newTask.date, newTask)
            const newColendar = colendar.getColendar()

            await db.collection("Users").updateOne({ _id: userData._id }, { schedules: newColendar })

            mgClient.close()
            logger.info("ScheduleController.changeTask -> OK")
        })
    }

    static async removeTask(userId: string, date: TDateScritg, taskId: string): Promise<void> {
        return await errorHandlerController(async () => {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const userData = await db.collection("Users").findOne({ id: userId })
            if (!userData) {
                const message = "User don`t found"
                mgClient.close()
                logger.debug("ScheduleController.removeTask -> " + message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }

            const userSchedules = userData.schedules
            const colendar = new Colendar(userSchedules)
            colendar.removeTask(date, taskId)
            const newColendar = colendar.getColendar()

            await db.collection("Users").updateOne({ _id: userData._id }, { schedules: newColendar })

            mgClient.close()
            logger.info("ScheduleController.removeTask -> OK")
        })
    }
}

