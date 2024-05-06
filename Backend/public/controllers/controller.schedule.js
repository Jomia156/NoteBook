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
const mgClient = new MongoClient(AppConfig.mongoURL);
export class ScheduleController {
    static get(userId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dateArr = date.split(".");
                const year = date[0];
                const month = date[1];
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const schedules = yield db.collection("Users").findOne({ id: userId, schedules:  }, { schedules: 1 });
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
    static create() {
    }
}
