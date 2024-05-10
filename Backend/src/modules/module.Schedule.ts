import errorHandlerModule from "../errorHendlers/errorHandler.Module";
import logger from "../components/logger";
import { ScheduleController } from "../controllers/controller.Schedule";
import { TDateScritg, TFastifyRequerst, TSchuduleData, TTask } from "../types";
import { FastifyReply } from "fastify";

export default class ScheduleModule {
    static async get(request: TFastifyRequerst<{ date: string }>, response: FastifyReply) {
        await errorHandlerModule(response, async () => {
            const date = request.query.date
            const userId = request.userData.id

            const schedules = await ScheduleController.get(userId, date)
            response.send({
                status: 200,
                data: schedules
            }).status(200)
            logger.info("ScheduleModule.get -> OK")
        })
    }

    static async createTask(request: TFastifyRequerst<TSchuduleData>, response: FastifyReply) {
        await errorHandlerModule(response, async () => {
            const scheduleData = request.body
            const userId = request.userData.id

            await ScheduleController.createTask(userId, scheduleData)
            response.send({
                status: 201
            }).status(201)
            logger.info("ScheduleModule.createTask -> OK")
        })
    }

    static async changeTask(request: TFastifyRequerst<TTask>, response: FastifyReply) {
        await errorHandlerModule(response, async () => {
            const newTask = request.body
            const userId = request.userData.id

            await ScheduleController.changeTask(userId, newTask)
            response.send({
                status: 201
            }).status(201)
            logger.info("ScheduleModule.changeTask -> OK")
        })
    }

    static async removeTask(request: TFastifyRequerst<{date:TDateScritg, taskId:string}>, response: FastifyReply) {
        await errorHandlerModule(response, async () => {
            const taskId = request.params.taskId
            const date = request.query.date
            const userId = request.userData.id

            await ScheduleController.removeTask(userId, date, taskId)
            response.send({
                status: 204
            }).status(204)
            logger.info("ScheduleModule.removeTask -> OK")
        })
    }
}