import { MongoClient, WithId, Document, FindCursor } from "mongodb";
import CustomError from "../components/CustomError";
import logger from "../components/logger";
import { AppConfig } from "../config";
import { generateID } from "../components/generator";
import { TNoteContent, TNoteData } from "../types";

const mgClient = new MongoClient(AppConfig.mongoURL)

export class NoteController {
    static async get(noteId: string, ownerId: string, collection: "Users" | "Schedules" = "Users"): Promise<WithId<Document>> {
        try {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const idnames = {
                Users: "ownerId",
                Schedules: "scheduleId"
            }

            const noteData = await db.collection("Notes").findOne({ id: noteId })
            if (!noteData) {
                let message = "Note dot`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_EXISIT", 404, message)
            }
            if (noteData.ownerId != ownerId) {
                let message = "Forbidden"
                logger.debug(message)
                throw new CustomError("FORBIDDEN", 403, message)
            }
            return noteData
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

    static async create(ownerId: string, note: TNoteData): Promise<void> {
        try {
            const noteData: TNoteData = {
                id: generateID(),
                ownerId: ownerId,
                title: note.title,
                content: note.content
            }

            await mgClient.connect()
            const db = mgClient.db("Notebook")

            await db.collection("Notes").insertOne(noteData)
            return
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

    static async getAll(ownerId: string, collection: "Users" | "Schedules" = "Users"): Promise<FindCursor<WithId<Document>> | Array<any>> {
        try {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const arrayNotesId = (await db.collection(collection).findOne({ id: ownerId })).notes
            const arrayNotes = await db.collection("Notes").find({ $elemMatch: { id: { $in: arrayNotesId } } })
            if (!arrayNotes) {
                return []
            }
            return arrayNotes

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

    static async removeById(ownerId: string, noteId: string): Promise<void> {
        try {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const note = await db.collection("Notes").findOne({ id: noteId })
            if (!note) {
                let message = "Note dot`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_EXISIT", 404, message)
            }
            if (!ownerId == note.ownerId) {
                logger.debug("NoteController.removeById -> FORIBBEN", 403, "There is no access")
                throw new CustomError("FORIBBEN", 403, "There is no access")
            }
            await db.collection("Note").deleteOne({ _id: note._id })
            return
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

    static async changeContent(ownerId:string, noteId: string, newContent: TNoteContent): Promise<void> {
        try {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const noteData = await db.collection("Notes").findOne({ id: noteId })
            if (!noteData) {
                let message = "Note dot`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_EXISIT", 404, message)
            }
            if (!ownerId == noteData.ownerId) {
                logger.debug("NoteController.removeById -> FORIBBEN", 403, "There is no access")
                throw new CustomError("FORIBBEN", 403, "There is no access")
            }
            await db.collection("Notes").updateOne({ _id: noteData._id }, { content: newContent })
            return
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