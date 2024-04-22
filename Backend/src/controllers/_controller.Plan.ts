import { MongoClient, WithId, Document, FindCursor } from "mongodb";
import CustomError from "../components/CustomError";
import logger from "../components/logger";
import { AppConfig } from "../config";
import { generateID } from "../components/generator";
import { TNoteContent, TNoteData } from "../types";

const mgClient = new MongoClient(AppConfig.mongoURL)

export class PlansController {
    static async getById(planId:string, userId:string):Promise<WithId<Document>> {
        try {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const planData = await db.collection("Plans").findOne({ id: planId })
            if (!planData) {
                let message = "Plan dot`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_EXISIT", 404, message)
            }
            if (planData.userId != userId) {
                let message = "Forbidden"
                logger.debug(message)
                throw new CustomError("FORBIDDEN", 403, message)
            }
            return planData
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

    static async getAllForUser(userId: string): Promise<FindCursor<WithId<Document>> | Array<any>> {
        try {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const arrayPlansId = (await db.collection("Users").findOne({ id: userId })).notes
            const arrayPlans = await db.collection("Plans").find({ $elemMatch: { id: { $in: arrayPlansId } } })
            if (!arrayPlans) {
                return []
            }
            return arrayPlans
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
}