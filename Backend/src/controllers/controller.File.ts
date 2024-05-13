import CustomError from "../components/CustomError";
import logger from "../components/logger";
import { AppConfig } from "../config";
import errorHandlerController from "../errorHendlers/errorHandler.Controller";

export class FileController {
    static async getFile(fileName: string): Promise<Buffer> {
        return await errorHandlerController(async ()=>{
            const file = await fetch(`http://${AppConfig.fileServerHost}:${AppConfig.fileServerPort}/files/${fileName}`)
            const arraBuffer = await file.arrayBuffer()
            const buffer = new Buffer(arraBuffer)
            logger.info("FileController.getFile -> OK")
            return buffer
        })
    } 

    static async uploadFile(file: Buffer, filename:string): Promise<string> {
        return await errorHandlerController(async ()=>{
            let formData = new FormData()
            formData.append("firstName", "John");
            formData.append("filedata", new Blob([file]), filename);

            const fileName = await fetch(`http://${AppConfig.fileServerHost}:${AppConfig.fileServerPort}/files`, {
                body: formData,
                headers: {
                    "Authorization":AppConfig.fileServerToken
                },
                method: "post",
            }).then(data=>data.json()).then(data=>data.data)
            logger.info("FileController.uploadFile -> OK")
            return fileName;
        })
    }

}