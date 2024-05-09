import errorHandlerModule from "../errorHendlers/errorHandler.Module";
import logger from "../components/logger";
import { NoteController } from "../controllers/controller.Note";
import { TFastifyRequerst, TNoteContent, TNoteData } from "../types";
import { FastifyReply } from "fastify";
import { EventController } from "../controllers/controller.Event";

export default class NoteModule {
    static async get(request: TFastifyRequerst<{ noteId: string, collection: any }>, response: FastifyReply) {
        await errorHandlerModule(response, async () => {
            const noteId = request.params.noteId
            const userId = request.userData.id
            const colection = request.params.collection

            const noteData = await NoteController.get(noteId, userId, colection)
            response.send({
                status: 200,
                data: noteData
            }).status(201)
            logger.info("NoteModule.get -> OK")
        })
    }

    static async create(request: TFastifyRequerst<TNoteData & {eventId:any}>, response: FastifyReply) {
        await errorHandlerModule(response, async () => {
            const noteData = request.body
            const userId = request.userData.id
            const eventId = request.params.eventId
            if (!eventId) {
                await NoteController.create(userId, noteData)
            }
            else {
                const eventData = await EventController.getData(userId, eventId)
                await NoteController.create(eventData.id, noteData)
            }
            response.send({
                status: 201
            }).status(201)
            logger.info("NoteModule.create -> OK")
        })
    }

    static async getAll(request: TFastifyRequerst<{eventId:any}>, response: FastifyReply) {
        await errorHandlerModule(response, async () => {
            const userId = request.userData.id
            const eventId = request.params.eventId
            let allNotes
            if (!eventId) {
                allNotes = await NoteController.getAll(userId)
            }
            else {
                const eventData = await EventController.getData(userId, eventId)
                allNotes = await NoteController.getAll(eventData.id, "Schedules")
            }
            response.send({
                status: 200,
                data: allNotes
            }).status(200)
            logger.info("NoteModule.getAll -> OK")
        })
    }

    static async remove(request: TFastifyRequerst<{ noteId: string, eventId:string}>, response: FastifyReply) {
        await errorHandlerModule(response, async () => {
            const noteId = request.params.noteId
            const userId = request.userData.id
            const eventId = request.params.eventId
            if (!eventId) {
                await NoteController.removeById(userId, noteId)
            }
            else {
                const eventData = await EventController.getData(userId, eventId)
                await NoteController.removeById(eventData.id, noteId)
            }
            response.send({
                status: 204
            }).status(204)
            logger.info("NoteModule.remove -> OK")
        })
    }

    static async changeContent(request: TFastifyRequerst<{ noteId: string, eventId:string } & TNoteContent>, response: FastifyReply) {
        await errorHandlerModule(response, async () => {
            const noteId = request.params.noteId
            const userId = request.userData.id
            const newContent = request.body
            const eventId = request.params.eventId
            if (!eventId) {
                await NoteController.changeContent(userId, noteId, newContent)
            }
            else {
                const eventData = await EventController.getData(userId, eventId)
                await NoteController.changeContent(eventData.id, noteId, newContent)
            }
            response.send({
                status: 201
            }).status(201)
        })
    }

}