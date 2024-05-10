var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import logger from "../components/logger";
import { AppConfig } from "../config";
import errorHandlerController from "../errorHendlers/errorHandler.Controller";
export class FileController {
    static getFile(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                const file = yield fetch(`http://${AppConfig.fileServerHost}:${AppConfig.fileServerPort}/files/${fileName}`);
                const arraBuffer = yield file.arrayBuffer();
                const buffer = new Buffer(arraBuffer);
                logger.info("FileController.getFile -> OK");
                return buffer;
            }));
        });
    }
    static uploadFile(file, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                let formData = new FormData();
                formData.append("firstName", "John");
                formData.append("filedata", new Blob([file]), filename);
                const fileName = yield fetch(`http://${AppConfig.fileServerHost}:${AppConfig.fileServerPort}/files`, {
                    body: formData,
                    headers: {
                        "Authorization": AppConfig.fileServerToken
                    },
                    method: "post",
                }).then(data => data.json()).then(data => data.data);
                logger.info("FileController.uploadFile -> OK");
                return fileName;
            }));
        });
    }
}
