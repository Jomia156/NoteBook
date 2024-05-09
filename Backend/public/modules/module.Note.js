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
import { NoteController } from "../controllers/controller.Note";
import { EventController } from "../controllers/controller.Event";
export default class NoteModule {
    static get(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const noteId = request.params.noteId;
                const userId = request.userData.id;
                const colection = request.params.collection;
                const noteData = yield NoteController.get(noteId, userId, colection);
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
                const userId = request.userData.id;
                const eventId = request.params.eventId;
                if (!eventId) {
                    yield NoteController.create(userId, noteData);
                }
                else {
                    const eventData = yield EventController.getData(userId, eventId);
                    yield NoteController.create(eventData.id, noteData);
                }
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
                const userId = request.userData.id;
                const eventId = request.params.eventId;
                let allNotes;
                if (!eventId) {
                    allNotes = yield NoteController.getAll(userId);
                }
                else {
                    const eventData = yield EventController.getData(userId, eventId);
                    allNotes = yield NoteController.getAll(eventData.id, "Schedules");
                }
                response.send({
                    status: 200,
                    data: allNotes
                }).status(200);
                logger.info("NoteModule.getAll -> OK");
            }));
        });
    }
    static remove(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const noteId = request.params.noteId;
                const userId = request.userData.id;
                const eventId = request.params.eventId;
                if (!eventId) {
                    yield NoteController.removeById(userId, noteId);
                }
                else {
                    const eventData = yield EventController.getData(userId, eventId);
                    yield NoteController.removeById(eventData.id, noteId);
                }
                response.send({
                    status: 204
                }).status(204);
                logger.info("NoteModule.remove -> OK");
            }));
        });
    }
    static changeContent(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const noteId = request.params.noteId;
                const userId = request.userData.id;
                const newContent = request.body;
                const eventId = request.params.eventId;
                if (!eventId) {
                    yield NoteController.changeContent(userId, noteId, newContent);
                }
                else {
                    const eventData = yield EventController.getData(userId, eventId);
                    yield NoteController.changeContent(eventData.id, noteId, newContent);
                }
                response.send({
                    status: 201
                }).status(201);
            }));
        });
    }
}
