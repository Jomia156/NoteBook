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
import { ScheduleController } from "../controllers/controller.Schedule";
export default class ScheduleModule {
    static get(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const date = request.query.date;
                const userId = request.userData.id;
                const schedules = yield ScheduleController.get(userId, date);
                response.send({
                    status: 200,
                    data: schedules
                }).status(200);
                logger.info("ScheduleModule.get -> OK");
            }));
        });
    }
    static createTask(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const scheduleData = request.body;
                const userId = request.userData.id;
                yield ScheduleController.createTask(userId, scheduleData);
                response.send({
                    status: 201
                }).status(201);
                logger.info("ScheduleModule.createTask -> OK");
            }));
        });
    }
    static changeTask(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const newTask = request.body;
                const userId = request.userData.id;
                yield ScheduleController.changeTask(userId, newTask);
                response.send({
                    status: 201
                }).status(201);
                logger.info("ScheduleModule.changeTask -> OK");
            }));
        });
    }
    static removeTask(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const taskId = request.params.taskId;
                const date = request.query.date;
                const userId = request.userData.id;
                yield ScheduleController.removeTask(userId, date, taskId);
                response.send({
                    status: 204
                }).status(204);
                logger.info("ScheduleModule.removeTask -> OK");
            }));
        });
    }
}
