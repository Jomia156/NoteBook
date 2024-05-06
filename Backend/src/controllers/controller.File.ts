import CustomError from "../components/CustomError";
import logger from "../components/logger";
import { AppConfig } from "../config";


export class FileController {
    static async getFile(fileName: string): Promise<Buffer> {
        try {
            const file = await fetch(`http://${AppConfig.fileServerHost}:${AppConfig.fileServerPort}/files/${fileName}`)
            const arraBuffer = await file.arrayBuffer()
            const buffer = new Buffer(arraBuffer)
            return buffer
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

    static async uploadFile(file: Buffer, filename:string): Promise<string> {
        try {
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
            return fileName;
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

}