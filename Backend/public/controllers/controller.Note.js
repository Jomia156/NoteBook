var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MongoClient } from "mongodb";
import CustomError from "../components/CustomError";
import logger from "../components/logger";
import { AppConfig } from "../config";
import { generateID } from "../components/generator";
import errorHandlerController from "../errorHendlers/errorHandler.Controller";
const mgClient = new MongoClient(AppConfig.mongoURL);
export class NoteController {
    static get(noteId_1, ownerId_1) {
        return __awaiter(this, arguments, void 0, function* (noteId, ownerId, collection = "Users") {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const noteData = yield db.collection("Notes").findOne({ id: noteId });
                if (!noteData) {
                    let message = "Note dot`t found";
                    mgClient.close();
                    logger.debug("NoteController.get -> " + message);
                    throw new CustomError("DATA_DONT_EXISIT", 404, message);
                }
                if (noteData.ownerId != ownerId) {
                    let message = "Forbidden";
                    mgClient.close();
                    logger.debug("NoteController.get -> " + message);
                    throw new CustomError("FORBIDDEN", 403, message);
                }
                mgClient.close();
                logger.info("NoteController.get -> OK");
                return noteData;
            }));
        });
    }
    static create(ownerId, note) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                const noteData = {
                    id: generateID(),
                    ownerId: ownerId,
                    title: note.title,
                    content: note.content
                };
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                yield db.collection("Notes").insertOne(noteData);
                mgClient.close();
                logger.info("NoteController.create -> OK");
                return;
            }));
        });
    }
    static getAll(ownerId_1) {
        return __awaiter(this, arguments, void 0, function* (ownerId, collection = "Users") {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const arrayNotesId = (yield db.collection(collection).findOne({ id: ownerId })).notes;
                const arrayNotes = yield db.collection("Notes").find({ $elemMatch: { id: { $in: arrayNotesId } } });
                if (!arrayNotes) {
                    return [];
                }
                mgClient.close();
                logger.info("NoteController.getAll -> OK");
                return arrayNotes;
            }));
        });
    }
    static removeById(ownerId, noteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const note = yield db.collection("Notes").findOne({ id: noteId });
                if (!note) {
                    let message = "Note dot`t found";
                    mgClient.close();
                    logger.debug("NoteController.removeById -> " + message);
                    throw new CustomError("DATA_DONT_EXISIT", 404, message);
                }
                if (!ownerId == note.ownerId) {
                    mgClient.close();
                    logger.debug("NoteController.removeById -> FORIBBEN");
                    throw new CustomError("FORIBBEN", 403, "There is no access");
                }
                yield db.collection("Note").deleteOne({ _id: note._id });
                mgClient.close();
                logger.info("NoteController.removeById -> OK");
                return;
            }));
        });
    }
    static changeContent(ownerId, noteId, newContent) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const noteData = yield db.collection("Notes").findOne({ id: noteId });
                if (!noteData) {
                    let message = "Note dot`t found";
                    mgClient.close();
                    logger.debug("NoteController.changeContent -> " + message);
                    throw new CustomError("DATA_DONT_EXISIT", 404, message);
                }
                if (!ownerId == noteData.ownerId) {
                    mgClient.close();
                    logger.debug("NoteController.changeContent -> FORIBBEN", 403, "There is no access");
                    throw new CustomError("FORIBBEN", 403, "There is no access");
                }
                yield db.collection("Notes").updateOne({ _id: noteData._id }, { content: newContent });
                mgClient.close();
                logger.info("NoteController.changeContent -> OK");
                return;
            }));
        });
    }
}
