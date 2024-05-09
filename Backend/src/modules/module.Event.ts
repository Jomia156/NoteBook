import errorHandlerModule from "../errorHendlers/errorHandler.Module";
import { EventController } from "../controllers/controller.Event";
import { TEventData, TEventDataForCreated, TFastifyRequerst, TListType } from "../types";
import { FastifyReply } from "fastify";
import logger from "../components/logger";

export default class EventModule {
    static async get(request: TFastifyRequerst<{ eventId: string }>, response: FastifyReply) {
        await errorHandlerModule(response, async () => {
            const userId = request.userData.id
            const eventId = request.params.eventId
            const eventData = await EventController.getData(userId, eventId)

            response.send({
                status: 200,
                data: eventData
            }).status(200)
            logger.info("EventModule.get -> OK")
        })
    }

    static async create(request: TFastifyRequerst<TEventDataForCreated>, response: FastifyReply) {
        await errorHandlerModule(response, async ()=>{
            const userId = request.userData.id
            const eventData = request.body

            await EventController.create(userId, eventData)
            response.send({
                status: 201
            }).status(201)
            logger.info("EventModule.create -> OK")
        })
    }

    static async remove(request: TFastifyRequerst<{eventId:string}>, response: FastifyReply) {
        await errorHandlerModule(response, async ()=>{
            const userId = request.userData.id
            const eventId = request.params.eventId

            await EventController.remove(userId, eventId)
            response.send({
                status: 204
            }).status(204)
            logger.info("EventModule.remove -> OK")
        })
    }

    static async changeData(request: TFastifyRequerst<{eventId:string} & TEventData>, response: FastifyReply) {
        await errorHandlerModule(response, async ()=>{
            const userId = request.userData.id
            const eventId = request.params.eventId
            const newEventData = request.body

            await EventController.changeData(userId, eventId, newEventData)
            response.send({
                status: 201
            }).status(201)
            logger.info("EventModule.changeData -> OK")
        })
    }

    static async getList(request: TFastifyRequerst<{eventId:string, listType:TListType} >, response: FastifyReply) {
        await errorHandlerModule(response, async ()=>{
            const userId = request.userData.id
            const eventId = request.params.eventId
            const listType = request.params.listType

            const list = await EventController.getList(userId, eventId, listType)
            response.send({
                status: 200,
                data:list
            }).status(200)
            logger.info("EventModule.getList -> OK")
        })
    }

}