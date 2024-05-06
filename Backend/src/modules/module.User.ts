import { FastifyReply, FastifyRequest } from "fastify";
import CustomError from "../components/CustomError";
import logger from "../components/logger";
import { UserController } from "../controllers/controller.User";
import errorHandlerModule from "../errorHendlers/errorHandler.Module";
import { TFastifyRequerst, TLoginData } from "../types";

export class UserModule {
    static async login(request:TFastifyRequerst<TLoginData>, response:FastifyReply) {
        await errorHandlerModule(response, async ()=>{
            console.log(request.query)
            return UserController.login(request.query)
        })
    }
}