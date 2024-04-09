import {TJWTPair} from "../types"
import CustomError from "./CustomError";
import logger from "./logger";
import { AppConfig } from "../config";
import jwt from "jsonwebtoken";

const secret = AppConfig.secretKey

export class JWTController {
    static async create(id: number):Promise<TJWTPair> {
        let payloadAccessToken: jwt.JwtPayload  = {
            id,
            type: "access"
        }
        let payloadRefreshToken: jwt.JwtPayload  = {
            id,
            type: "refresh"
        }
        logger.debug("Pari JWT tokens has been created")
        return {
            accessToken: jwt.sign(payloadAccessToken, secret , {expiresIn: AppConfig.accessToken_lifetime}),
            refreshToken: jwt.sign(payloadRefreshToken, secret,  {expiresIn: AppConfig.refreshToken_lifeTime})
        }
    }

    static async getPayload(jwtToken:string):Promise<jwt.JwtPayload> {
        let result:jwt.JwtPayload;
        await new Promise((resolove,reject)=>{
            let payload = jwt.verify(jwtToken, secret)
            if (payload) {
                resolove(payload)
            }
            else {
                reject(new Error("Token don`t original"))
            }
        }).then(payload=>{
            logger.debug("Payload for user has been received")
            result = payload
        }).catch(err=>{
            logger.warn(err.message)
            throw new CustomError("TOKEN_DONT_ORIGINAL", 403, err.message)
        })
        return result

    }
}



