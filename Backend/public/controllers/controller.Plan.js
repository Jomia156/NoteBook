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
const mgClient = new MongoClient(AppConfig.mongoURL);
export class PlansController {
    static getById(planId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const planData = yield db.collection("Plans").findOne({ id: planId });
                if (!planData) {
                    let message = "Plan dot`t found";
                    logger.debug(message);
                    throw new CustomError("DATA_DONT_EXISIT", 404, message);
                }
                if (planData.userId != userId) {
                    let message = "Forbidden";
                    logger.debug(message);
                    throw new CustomError("FORBIDDEN", 403, message);
                }
                return planData;
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
    static getAllForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const arrayPlansId = (yield db.collection("Users").findOne({ id: userId })).notes;
                const arrayPlans = yield db.collection("Plans").find({ $elemMatch: { id: { $in: arrayPlansId } } });
                if (!arrayPlans) {
                    return [];
                }
                return arrayPlans;
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
