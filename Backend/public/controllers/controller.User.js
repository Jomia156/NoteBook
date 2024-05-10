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
import { AppConfig } from "../config";
import { JWTController } from "../components/JWT";
import { generateID, generateVerifiCode } from "../components/generator";
import { PasswordHesh } from "../components/PasswordHash";
import logger from "../components/logger";
import CustomError from "../components/CustomError";
import MailController from "../components/MailController";
import { test } from "../components/Colendar";
import errorHandlerController from "../errorHendlers/errorHandler.Controller";
const mgClient = new MongoClient(AppConfig.mongoURL);
export class UserController {
    static register(regData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                const userData = {
                    id: generateID(),
                    login: regData.login,
                    name: regData.name,
                    email: regData.email,
                    passwordHash: PasswordHesh.generate(regData.password),
                    avatar: null,
                    verified: false,
                    notes: [],
                    events: [],
                    plans: [],
                    schedules: Object.assign({}, test())
                };
                const verificationSession = {
                    id: generateID(),
                    userId: userData.id,
                    createDateTime: Date.now(),
                    code: generateVerifiCode()
                };
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const testEmailadnLogin = yield db.collection("Users").findOne({ $or: [{ login: regData.login }, { email: regData.email }] });
                if (testEmailadnLogin) {
                    let message = "Login or Email already exsist";
                    logger.debug(message);
                    throw new CustomError("DATA_EXISIT", 406, message);
                }
                yield db.collection("Users").insertOne(userData);
                const session = yield db.collection("Verifications").insertOne(verificationSession);
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield mgClient.connect();
                    const db = mgClient.db("Notebook");
                    yield db.collection("Verifications").deleteOne({ _id: session.insertedId });
                }), AppConfig.verefiSessions_lifetime);
                MailController(regData.email, verificationSession.code);
                logger.debug("UserController.register -> OK");
                return;
            }));
        });
    }
    static login(loginData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const userData = yield db.collection("Users").findOne({ login: loginData.login });
                if (!userData) {
                    const message = "User don`t found";
                    mgClient.close();
                    logger.debug("UserController.login ->" + message);
                    throw new CustomError("DATA_DONT_FOUND", 404, message);
                }
                if (PasswordHesh.verify(loginData.password, userData.passwordHash)) {
                    logger.debug("UserController.login -> OK");
                    return yield JWTController.create(userData.id);
                }
                else {
                    const message = "User don`t found";
                    mgClient.close();
                    logger.debug("UserController.login ->" + message);
                    throw new CustomError("DATA_DONT_FOUND", 404, message);
                }
            }));
        });
    }
    static loginForRefresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                const payload = yield JWTController.getPayload(refreshToken);
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const userData = yield db.collection("Users").findOne({ id: payload.id });
                if (!userData) {
                    const message = "User don`t found";
                    mgClient.close();
                    logger.debug("UserController.loginForRefresh ->" + message);
                    throw new CustomError("DATA_DONT_FOUND", 404, message);
                }
                logger.debug("UserController.loginForRefresh -> OK");
                return yield JWTController.create(payload.id);
            }));
        });
    }
    static removeUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                yield mgClient.connect();
                const db = mgClient.db("Notebook");
                const userData = yield db.collection("Users").findOne({ id: userId });
                if (!userData) {
                    const message = "User don`t found";
                    mgClient.close();
                    logger.debug("UserController.removeUser ->" + message);
                    throw new CustomError("DATA_DONT_FOUND", 404, message);
                }
                yield db.collection("Users").deleteOne({ _id: userData._id });
                logger.debug("UserController.removeUser -> OK");
                return;
            }));
        });
    }
    static verifiedUser(userId, verifiCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                mgClient.connect();
                const db = mgClient.db("Notebook");
                const userData = yield db.collection("Users").findOne({ id: userId });
                if (!userData) {
                    const message = "User don`t found";
                    mgClient.close();
                    logger.debug("UserController.verifiedUser ->" + message);
                    throw new CustomError("DATA_DONT_FOUND", 404, message);
                }
                const verificationSession = yield db.collection("Verifications").findOne({ userId: userId });
                if (!verificationSession) {
                    const message = "Session don`t found";
                    mgClient.close();
                    logger.debug("UserController.verifiedUser ->" + message);
                    throw new CustomError("DATA_DONT_FOUND", 404, message);
                }
                if (verificationSession.code == verifiCode) {
                    yield db.collection("Users").updateOne({ id: userId }, { verified: true });
                    yield db.collection("Verifications").deleteOne({ _id: verificationSession._id });
                    mgClient.close();
                    logger.debug("UserController.verifiedUser -> OK");
                    return;
                }
                const message = "User don`t confirmed";
                mgClient.close();
                logger.debug("UserController.verifiedUser ->" + message);
                throw new CustomError("USER_DONT_CONFIRM", 422, message);
            }));
        });
    }
    static verificationReload(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                mgClient.connect();
                const db = mgClient.db("Notebook");
                const userData = yield db.collection("User").findOne({ id: userId });
                if (!userData) {
                    const message = "User don`t found";
                    mgClient.close();
                    logger.debug("UserController.verificationReload ->" + message);
                    throw new CustomError("DATA_DONT_FOUND", 404, message);
                }
                const verificationSession = yield db.collection("Verifications").findOne({ userId });
                const newVerifiCode = generateVerifiCode();
                if (verificationSession) {
                    yield db.collection("Verifications").updateOne({ userId }, { code: newVerifiCode });
                }
                else {
                    const verificationSession = {
                        id: generateID(),
                        userId,
                        createDateTime: Date.now(),
                        code: generateVerifiCode()
                    };
                    const session = yield db.collection("Verifications").insertOne(verificationSession);
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        yield mgClient.connect();
                        const db = mgClient.db("Notebook");
                        yield db.collection("Verifications").deleteOne({ _id: session.insertedId });
                    }), AppConfig.verefiSessions_lifetime);
                    MailController(userData.email, verificationSession.code);
                }
                mgClient.close();
                logger.info("Verification seesion has been upload");
                return;
            }));
        });
    }
    static changeUserData(userId, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                mgClient.connect();
                const db = mgClient.db("Notebook");
                const userData = yield db.collection("User").findOne({ id: userId });
                if (!userData) {
                    const message = "User don`t found";
                    mgClient.close();
                    logger.debug("UserController.changeUserData ->" + message);
                    throw new CustomError("DATA_DONT_FOUND", 404, message);
                }
                let changeData = {};
                if (newData.password) {
                    changeData.passwordHash = PasswordHesh.generate(newData.password);
                }
                else {
                    changeData = Object.assign({}, newData);
                }
                yield db.collection("Users").updateOne({ _id: userData._id }, { changeData });
                mgClient.close();
                logger.info("UserController.changeUserData -> OK");
                return;
            }));
        });
    }
    static getData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                mgClient.connect();
                const db = mgClient.db("Notebook");
                const userData = yield db.collection("Users").findOne({ id: userId });
                if (!userData) {
                    const message = "User don`t found";
                    mgClient.close();
                    logger.debug("UserController.getData ->" + message);
                    throw new CustomError("DATA_DONT_FOUND", 404, message);
                }
                mgClient.close();
                logger.info("UserController.getData -> OK");
                return userData;
            }));
        });
    }
    static getList(userId, listName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield errorHandlerController(() => __awaiter(this, void 0, void 0, function* () {
                mgClient.connect();
                const db = mgClient.db("Notebook");
                const userData = yield db.collection("Users").findOne({ id: userId });
                if (!userData) {
                    const message = "User don`t found";
                    mgClient.close();
                    logger.debug("UserController.getList ->" + message);
                    throw new CustomError("DATA_DONT_FOUND", 404, message);
                }
                mgClient.close();
                logger.info("UserController.getList -> OK");
                return userData[listName];
            }));
        });
    }
}
