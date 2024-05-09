var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserController } from "../controllers/controller.User";
import errorHandlerModule from "../errorHendlers/errorHandler.Module";
export class UserModule {
    static login(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const jwtPair = yield UserController.login(request.query);
                response.send({
                    statusCode: 200,
                    data: jwtPair
                }).status(200);
            }));
        });
    }
    static register(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                yield UserController.register(request.body);
                response.send({
                    statusCode: 201
                }).status(201);
            }));
        });
    }
    static loginForRefresh(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const refreshToken = request.headers.authorization;
                const jwtPair = yield UserController.loginForRefresh(refreshToken);
                response.send({
                    statusCode: 200,
                    data: jwtPair
                }).status(200);
            }));
        });
    }
    static removeUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                yield UserController.removeUser(request.userData.id);
                response.send({
                    statusCode: 204
                }).status(204);
            }));
        });
    }
    static verifiedUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                yield UserController.verifiedUser(request.userData.id, request.body.verificationCode);
                response.send({
                    statusCode: 201
                }).status(201);
            }));
        });
    }
    static verificationReload(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                yield UserController.verificationReload(request.userData.id);
                response.send({
                    statusCode: 201
                }).status(201);
            }));
        });
    }
    static changeUserData(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                yield UserController.changeUserData(request.userData.id, request.body);
                response.send({
                    statusCode: 201
                }).status(201);
            }));
        });
    }
    static getUserData(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                const userData = yield UserController.getData(request.userData.id);
                response.send({
                    statusCode: 200,
                    data: userData
                }).status(200);
            }));
        });
    }
    static getList(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield errorHandlerModule(response, () => __awaiter(this, void 0, void 0, function* () {
                if (request.params.listType == "events") {
                    const list = yield UserController.getList(request.userData.id, "events");
                    response.send({
                        statusCode: 200,
                        data: list
                    }).status(200);
                }
                else if (request.params.listType == "notes") {
                    const list = yield UserController.getList(request.userData.id, "notes");
                    response.send({
                        statusCode: 200,
                        data: list
                    }).status(200);
                }
            }));
        });
    }
}
