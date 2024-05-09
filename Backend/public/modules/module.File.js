var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import errorHandlerModule from "../errorHendlers/errorHandler.Module";
import logger from "../components/logger";
import { FileController } from "../controllers/controller.File";
export default class ModuleFile {
    static getFile(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const fileBuffer = yield FileController.getFile(request.params.filename);
                logger.info("ModuleFile.getFile -> OK");
                response.send(fileBuffer);
            }));
        });
    }
    static uploadFile(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const part = yield request.file();
                let file = yield part.toBuffer();
                let buffer = Buffer.from(file);
                const name = yield FileController.uploadFile(buffer, part.filename);
                response.send({
                    status: 201,
                    data: name
                });
                logger.info("ModuleFile.uploadFile -> OK");
            }));
        });
    }
}
