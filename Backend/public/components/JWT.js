var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import CustomError from "./CustomError";
import logger from "./logger";
import { AppConfig } from "../config";
import jwt from "jsonwebtoken";
const secret = AppConfig.secretKey;
export class JWTController {
    static create(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let payloadAccessToken = {
                id,
                type: "access"
            };
            let payloadRefreshToken = {
                id,
                type: "refresh"
            };
            logger.debug("Pari JWT tokens has been created");
            return {
                accessToken: jwt.sign(payloadAccessToken, secret, { expiresIn: AppConfig.accessToken_lifetime }),
                refreshToken: jwt.sign(payloadRefreshToken, secret, { expiresIn: AppConfig.refreshToken_lifeTime })
            };
        });
    }
    static getPayload(jwtToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            yield new Promise((resolove, reject) => {
                let payload = jwt.verify(jwtToken, secret);
                if (payload) {
                    resolove(payload);
                }
                else {
                    reject(new Error("Token don`t original"));
                }
            }).then(payload => {
                logger.debug("Payload for user has been received");
                result = payload;
            }).catch(err => {
                logger.warn(err.message);
                throw new CustomError("TOKEN_DONT_ORIGINAL", 403, err.message);
            });
            return result;
        });
    }
}
