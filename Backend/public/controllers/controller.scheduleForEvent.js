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
import CustomError from "../components/CustomError";
import { MongoClient } from "mongodb";
import { AppConfig } from "../config";
import errorHandlerController from "../errorHendlers/errorHandler.Controller";
import { Colendar } from "../components/Colendar";
const mgClient = new MongoClient(AppConfig.mongoURL);
export class ScheduleForEventController {
    static get(eventId_1) {
        return __awaiter(this, arguments, void 0, function* (eventId, date = null) {
            try {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                if (date) {
                    const schedules = yield db.collection("Schedules").findOne({ id: eventId, schedules:  }, { schedules: 1 });
                    const colendar = new Colendar(schedules);
                    colendar.getColendarFromMonth(date);
                    return colendar.getColendar();
                }
                else {
                    const schedules = yield db.collection("Schedules").findOne({ id: eventId, schedules:  }, { schedules: 1 });
                    return schedules;
                }
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
    static createTask(eventId, scheduleData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const userData = yield db.collection("Schedules").findOne({ id: eventId });
                if (!userData) {
                    const message = "User don`t found";
                    logger.debug("ScheduleController.createTask -> " + message);
                    throw new CustomError("DATA_DONT_FOUND", 404, message);
                }
                const Scheduleschedules = userData.schedules;
                const colendar = new Colendar(Scheduleschedules);
                colendar.appendTask(scheduleData.date, scheduleData.task);
                const newColendar = colendar.getColendar();
                yield db.collection("Schedules").updateOne({ _id: userData._id }, { schedules: newColendar });
                mgClient.close();
                logger.info("ScheduleController.createTask -> OK");
            }));
        });
    }
    static changeTask(eventId, newTask) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const userData = yield db.collection("Schedules").findOne({ id: eventId });
                if (!userData) {
                    const message = "User don`t found";
                    logger.debug("ScheduleController.create -> " + message);
                    throw new CustomError("DATA_DONT_FOUND", 404, message);
                }
                const Scheduleschedules = userData.schedules;
                const colendar = new Colendar(Scheduleschedules);
                colendar.uploadTask(newTask.date, newTask);
                const newColendar = colendar.getColendar();
                yield db.collection("Schedules").updateOne({ _id: userData._id }, { schedules: newColendar });
                mgClient.close();
                logger.info("ScheduleController.changeTask -> OK");
            }));
        });
    }
    static removeTask(eventId, taskData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const userData = yield db.collection("Schedules").findOne({ id: eventId });
                if (!userData) {
                    const message = "User don`t found";
                    logger.debug("ScheduleController.create -> " + message);
                    throw new CustomError("DATA_DONT_FOUND", 404, message);
                }
                const Scheduleschedules = userData.schedules;
                const colendar = new Colendar(Scheduleschedules);
                colendar.removeTask(taskData.date, taskData.taskId);
                const newColendar = colendar.getColendar();
                yield db.collection("Schedules").updateOne({ _id: userData._id }, { schedules: newColendar });
                mgClient.close();
                logger.info("ScheduleController.changeTask -> OK");
            }));
        });
    }
}
