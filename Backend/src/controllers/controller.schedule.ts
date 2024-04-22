import logger from "../components/logger";
import CustomError from "../components/CustomError";
import { MongoClient, WithId, Document, FindCursor } from "mongodb";
import { AppConfig } from "../config";
import { generateID } from "../components/generator";
import { describe } from "node:test";

const mgClient = new MongoClient(AppConfig.mongoURL)

export class ScheduleController {
    static async get(userId: string, date: string) {
        try {
            const dateArr = date.split(".")
            const year = date[0]
            const month = date[1]

            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const schedules = await db.collection("Users").findOne({ id: userId, schedules: }, { schedules: 1 })

        }
        catch (err) {
            if (err instanceof CustomError) {
                throw err
            }
            else {
                logger.error(err)
                throw new CustomError("UNEXPECTION_ERROR", 500, "Неожидання ошибка сервера")
            }
        }
        finally {
            mgClient.close()
        }
    }

    static create() {

    }
}

