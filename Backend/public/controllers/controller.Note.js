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
const mgClient = new MongoClient(AppConfig.mongoURL);
export class NoteController {
    static get(noteId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const noteData = yield db.collection("Notes").findOne({ id: noteId });
                if (!noteData) {
                    let message = "Note dot`t found";
                    logger.debug(message);
                    throw new CustomError("DATA_DONT_EXISIT", 404, message);
                }
                if (noteData.userId != userId) {
                    let message = "Forbidden";
                    logger.debug(message);
                    throw new CustomError("FORBIDDEN", 403, message);
                }
                return noteData;
            }
            catch (err) {
                if (err instanceof CustomError) {
                    throw err;
                }
                else {
                    logger.error(err);
                    throw new CustomError("UNEXPECTION_ERROR", 500, "Неожидання ошибка сервера");
                }
            }
            finally {
                mgClient.close();
            }
        });
    }
    static create(userId, note) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const noteData = {
                    id: generateID(),
                    userId: userId,
                    title: note.title,
                    content: note.content
                };
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                yield db.collection("Notes").insertOne(noteData);
                return;
            }
            catch (err) {
                if (err instanceof CustomError) {
                    throw err;
                }
                else {
                    logger.error(err);
                    throw new CustomError("UNEXPECTION_ERROR", 500, "Неожидання ошибка сервера");
                }
            }
            finally {
                mgClient.close();
            }
        });
    }
    static getAll(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, collection = "Users") {
            try {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const arrayNotesId = (yield db.collection(collection).findOne({ id: userId })).notes;
                const arrayNotes = yield db.collection("Notes").find({ $elemMatch: { id: { $in: arrayNotesId } } });
                if (!arrayNotes) {
                    return [];
                }
                return arrayNotes;
            }
            catch (err) {
                if (err instanceof CustomError) {
                    throw err;
                }
                else {
                    logger.error(err);
                    throw new CustomError("UNEXPECTION_ERROR", 500, "Неожидання ошибка сервера");
                }
            }
            finally {
                mgClient.close();
            }
        });
    }
    static removeById(noteId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const note = yield db.collection("Notes").findOne({ id: noteId });
                if (!note) {
                    let message = "Note dot`t found";
                    logger.debug(message);
                    throw new CustomError("DATA_DONT_EXISIT", 404, message);
                }
                yield db.collection("Note").deleteOne({ _id: note._id });
                return;
            }
            catch (err) {
                if (err instanceof CustomError) {
                    throw err;
                }
                else {
                    logger.error(err);
                    throw new CustomError("UNEXPECTION_ERROR", 500, "Неожидання ошибка сервера");
                }
            }
            finally {
                mgClient.close();
            }
        });
    }
    static changeContent(noteId, newContent) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const noteData = yield db.collection("Notes").findOne({ id: noteId });
                if (!noteData) {
                    let message = "Note dot`t found";
                    logger.debug(message);
                    throw new CustomError("DATA_DONT_EXISIT", 404, message);
                }
                yield db.collection("Notes").updateOne({ _id: noteData._id }, { content: newContent });
                return;
            }
            catch (err) {
                if (err instanceof CustomError) {
                    throw err;
                }
                else {
                    logger.error(err);
                    throw new CustomError("UNEXPECTION_ERROR", 500, "Неожидання ошибка сервера");
                }
            }
            finally {
                mgClient.close();
            }
        });
    }
}
