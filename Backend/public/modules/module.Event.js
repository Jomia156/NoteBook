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
import { EventController } from "../controllers/controller.Event";
import logger from "../components/logger";
export default class EventModule {
    static get(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const userId = request.userData.id;
                const eventId = request.params.eventId;
                const eventData = yield EventController.getData(userId, eventId);
                response.send({
                    status: 200,
                    data: eventData
                }).status(200);
                logger.info("EventModule.get -> OK");
            }));
        });
    }
    static create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const userId = request.userData.id;
                const eventData = request.body;
                yield EventController.create(userId, eventData);
                response.send({
                    status: 201
                }).status(201);
                logger.info("EventModule.create -> OK");
            }));
        });
    }
    static remove(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const userId = request.userData.id;
                const eventId = request.params.eventId;
                yield EventController.remove(userId, eventId);
                response.send({
                    status: 204
                }).status(204);
                logger.info("EventModule.remove -> OK");
            }));
        });
    }
    static changeData(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const userId = request.userData.id;
                const eventId = request.params.eventId;
                const newEventData = request.body;
                yield EventController.changeData(userId, eventId, newEventData);
                response.send({
                    status: 201
                }).status(201);
                logger.info("EventModule.changeData -> OK");
            }));
        });
    }
    static getList(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const userId = request.userData.id;
                const eventId = request.params.eventId;
                const listType = request.params.listType;
                const list = yield EventController.getList(userId, eventId, listType);
                response.send({
                    status: 200,
                    data: list
                }).status(200);
                logger.info("EventModule.getList -> OK");
            }));
        });
    }
}
