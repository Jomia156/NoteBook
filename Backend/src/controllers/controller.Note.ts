import { MongoClient, WithId, Document, FindCursor } from "mongodb";
import CustomError from "../components/CustomError";
import logger from "../components/logger";
import { AppConfig } from "../config";
import { generateID } from "../components/generator";
import { TNoteContent, TNoteData } from "../types";
import errorHandlerController from "../errorHendlers/errorHandler.Controller";


const mgClient = new MongoClient(AppConfig.mongoURL)

export class NoteController {
    static async get(noteId: string, ownerId: string, collection: "Users" | "Schedules" = "Users"): Promise<WithId<Document>> {
        return await errorHandlerController(async () => {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const noteData = await db.collection("Notes").findOne({ id: noteId })
            if (!noteData) {
                let message = "Note dot`t found"
                mgClient.close()
                logger.debug("NoteController.get -> " + message)
                throw new CustomError("DATA_DONT_EXISIT", 404, message)
            }
            if (noteData.ownerId != ownerId) {
                let message = "Forbidden"
                mgClient.close()
                logger.debug("NoteController.get -> " + message)
                throw new CustomError("FORBIDDEN", 403, message)
            }
            mgClient.close()
            logger.info("NoteController.get -> OK")
            return noteData
        })
    }

    static async create(ownerId: string, note: TNoteData): Promise<void> {
        return await errorHandlerController(async () => {
            const noteData: TNoteData = {
                id: generateID(),
                ownerId: ownerId,
                title: note.title,
                content: note.content
            }

            await mgClient.connect()
            const db = mgClient.db("Notebook")

            await db.collection("Notes").insertOne(noteData)
            mgClient.close()
            logger.info("NoteController.create -> OK")
            return
        })
    }

    static async getAll(ownerId: string, collection: "Users" | "Schedules" = "Users"): Promise<FindCursor<WithId<Document>> | Array<any>> {
        return await errorHandlerController(async () => {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const arrayNotesId = (await db.collection(collection).findOne({ id: ownerId })).notes
            const arrayNotes = await db.collection("Notes").find({ $elemMatch: { id: { $in: arrayNotesId } } })
            if (!arrayNotes) {
                return []
            }
            mgClient.close()
            logger.info("NoteController.getAll -> OK")
            return arrayNotes
        })
    }

    static async removeById(ownerId: string, noteId: string): Promise<void> {
        return await errorHandlerController(async () => {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const note = await db.collection("Notes").findOne({ id: noteId })
            if (!note) {
                let message = "Note dot`t found"
                mgClient.close()
                logger.debug("NoteController.removeById -> " + message)
                throw new CustomError("DATA_DONT_EXISIT", 404, message)
            }
            if (!ownerId == note.ownerId) {
                mgClient.close()
                logger.debug("NoteController.removeById -> FORIBBEN")
                throw new CustomError("FORIBBEN", 403, "There is no access")
            }
            await db.collection("Note").deleteOne({ _id: note._id })
            mgClient.close()
            logger.info("NoteController.removeById -> OK")
            return
        })
    }

    static async changeContent(ownerId: string, noteId: string, newContent: TNoteContent): Promise<void> {
        return await errorHandlerController(async () => {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const noteData = await db.collection("Notes").findOne({ id: noteId })
            if (!noteData) {
                let message = "Note dot`t found"
                mgClient.close()
                logger.debug("NoteController.changeContent -> " + message)
                throw new CustomError("DATA_DONT_EXISIT", 404, message)
            }
            if (!ownerId == noteData.ownerId) {
                mgClient.close()
                logger.debug("NoteController.changeContent -> FORIBBEN", 403, "There is no access")
                throw new CustomError("FORIBBEN", 403, "There is no access")
            }
            await db.collection("Notes").updateOne({ _id: noteData._id }, { content: newContent })
            mgClient.close()
            logger.info("NoteController.changeContent -> OK")
            return
        })
    }
}