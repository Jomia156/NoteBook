import { FastifyReply } from "fastify";
import CustomError from "../components/CustomError";
import logger from "../components/logger";

export default async function (collback: Function) {
    try {
        return await collback()
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
}