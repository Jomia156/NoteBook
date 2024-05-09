var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import errorHandlerModule from "../../errorHendlers/errorHandler.Module";
import logger from "../../components/logger";
import { NoteController } from "../../controllers/controller.Note";
export default class NoteModule {
    static get(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const noteId = request.params.noteId;
                const userId = request.userData.userId;
                const noteData = yield NoteController.get(noteId, userId);
                response.send({
                    status: 200,
                    data: noteData
                }).status(201);
                logger.info("NoteModule.get -> OK");
            }));
        });
    }
    static create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const noteData = request.body;
                const userId = request.userData.userId;
                yield NoteController.create(userId, noteData);
                response.send({
                    status: 201
                }).status(201);
                logger.info("NoteModule.create -> OK");
            }));
        });
    }
    static getAll(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const userId = request.userData.userId;
                const allNotes = yield NoteController.getAll(userId);
                response.send({
                    status: 200,
                    data: allNotes
                }).status(200);
                logger.info("NoteModule.getAll -> OK");
            }));
        });
    }
}
