var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import errorHandlerController from "../errorHendlers/errorHandler.Controller";
import { MongoClient } from "mongodb";
import { AppConfig } from "../config";
import { generateID } from "../components/generator";
import CustomError from "../components/CustomError";
import logger from "../components/logger";
const mgClient = new MongoClient(AppConfig.mongoURL);
export class EventController {
    static create(ownerId, eventData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const newEvent = {
                    id: generateID(),
                    ownerId: ownerId,
                    title: eventData.title,
                    description: eventData.decription,
                    date: eventData.date,
                    time: eventData.time,
                    geoposition: eventData.geoposition,
                    avatar: null
                };
                yield db.collection("Events").insertOne(newEvent);
                mgClient.close();
                logger.info("EventController.create -> OK");
            }));
        });
    }
    static remove(ownerId, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const eventData = yield db.collection("Events").findOne({ id: eventId });
                if (!eventData) {
                    mgClient.close();
                    logger.debug("EventController.remove -> Event don`t found");
                    throw new CustomError("DATA_DONT_FOUND", 404, "Event don`t found");
                }
                if (eventData.ownerId != ownerId) {
                    let message = "Forbidden";
                    mgClient.close();
                    logger.debug(message);
                    throw new CustomError("FORBIDDEN", 403, message);
                }
                yield db.collection("Events").deleteOne({ id: eventId });
                mgClient.close();
                logger.info("EventController.remove -> OK");
            }));
        });
    }
    static changeData(ownerId, eventId, newEventData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const eventData = yield db.collection("Events").findOne({ id: eventId });
                if (!eventData) {
                    mgClient.close();
                    logger.debug("EventController.chamgeData -> Event don`t found");
                    throw new CustomError("DATA_DONT_FOUND", 404, "Event don`t found");
                }
                if (eventData.ownerId != ownerId) {
                    let message = "Forbidden";
                    mgClient.close();
                    logger.debug(message);
                    throw new CustomError("FORBIDDEN", 403, message);
                }
                yield db.collection("Events").updateOne({ _id: eventData._id }, newEventData);
                mgClient.close();
                logger.info("EventController.chamgeData -> OK");
            }));
        });
    }
    static getData(ownerId, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const eventData = yield db.collection("Events").findOne({ id: eventId });
                if (!eventData) {
                    mgClient.close();
                    logger.debug("EventController.getData -> Event don`t found");
                    throw new CustomError("DATA_DONT_FOUND", 404, "Event don`t found");
                }
                if (!ownerId == eventData.ownerId) {
                    mgClient.close();
                    logger.debug("NoteController.removeById -> FORIBBEN", 403, "There is no access");
                    throw new CustomError("FORIBBEN", 403, "There is no access");
                }
                mgClient.close();
                logger.info("EventController.getData -> OK");
                return eventData;
            }));
        });
    }
    static getList(ownerId, eventId, listType) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const eventData = yield db.collection("Events").findOne({ id: eventId });
                if (!eventData) {
                    mgClient.close();
                    logger.debug("EventController.getList -> Event don`t found");
                    throw new CustomError("DATA_DONT_FOUND", 404, "Event don`t found");
                }
                if (eventData.ownerId != ownerId) {
                    let message = "Forbidden";
                    mgClient.close();
                    logger.debug(message);
                    throw new CustomError("FORBIDDEN", 403, message);
                }
                mgClient.close();
                logger.info("EventController.getList -> OK");
                return eventData[listType];
            }));
        });
    }
}
