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
            let data = new FormData()
            data.append(' ', new Blob([file]), filename);

            const fileName = await fetch(`http://${AppConfig.fileServerHost}:${AppConfig.fileServerPort}/files`, {
                body: data,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    // "Content-Type": "multipart/form-data",
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