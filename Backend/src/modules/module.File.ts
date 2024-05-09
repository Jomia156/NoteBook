import errorHandlerModule from "../errorHendlers/errorHandler.Module";
import logger from "../components/logger";
import { FileController } from "../controllers/controller.File";
import { TFastifyRequerst } from "../types";
import { FastifyReply } from "fastify";


export default class ModuleFile {
    static async getFile(request: TFastifyRequerst<{ filename: string }>, response: FastifyReply) {
        return await errorHandlerModule(response, async () => {
            const fileBuffer = await FileController.getFile(request.params.filename)
            logger.info("ModuleFile.getFile -> OK")
            response.send(fileBuffer)
        })
    }

    static async uploadFile(request: TFastifyRequerst<{ filename: string }>, response: FastifyReply) {
        return await errorHandlerModule(response, async () => {
            const part = await request.file()
            let file = await part.toBuffer()
            let buffer = Buffer.from(file);
            const name = await FileController.uploadFile(buffer, part.filename)

            response.send({
                status: 201,
                data: name
            })
            logger.info("ModuleFile.uploadFile -> OK")
        })
    }
}