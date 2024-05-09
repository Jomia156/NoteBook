var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { JWTController } from "../components/JWT.js";
import CustomError from "../components/CustomError.js";
import logger from "../components/logger.js";
import { UserController } from "../controllers/controller.User.js";
export const authorization = (req, reply, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers.authorization) {
            yield JWTController.getPayload(req.headers.authorization).then((payload) => __awaiter(void 0, void 0, void 0, function* () {
                if (payload.type == "access") {
                    req.userData = yield UserController.getData(payload.userId);
                    done();
                }
                else {
                    reply.send({
                        status: 403,
                        description: "There is no access",
                        code: "FORIBBEN"
                    }).status(403);
                }
            }));
        }
        return;
    }
    catch (err) {
        if (err instanceof CustomError) {
            reply.send({
                status: err.status,
                description: err.message
            }).status(err.status);
        }
        else {
            logger.error(err);
            reply.send({
                status: 500,
                description: "Unexpected error"
            }).status(500);
        }
    }
});
