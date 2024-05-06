import { FastifyReply } from "fastify";
import CustomError from "../components/CustomError";
import logger from "../components/logger";

export default async function (reply: FastifyReply, collback: Function) {
    try {
        await collback()
    }
    catch (err) {
        if (err instanceof CustomError) {
            reply.send({
                statusCode: err.status,
                descriptin: err.message,
                code: err.code
            }).status(err.status)
        }
        else {
            logger.error(err)
            reply.send({
                statusCode: 500,
                descriptin: "Неожидання ошибка сервера",
                code: "UNEXPECTION_ERROR"
            }).status(500)
        }
    }
}