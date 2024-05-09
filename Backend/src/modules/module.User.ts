import { FastifyReply, FastifyRequest } from "fastify";
import CustomError from "../components/CustomError";
import logger from "../components/logger";
import { UserController } from "../controllers/controller.User";
import errorHandlerModule from "../errorHendlers/errorHandler.Module";
import { TChangeDataForUser, TFastifyRequerst, TListType, TLoginData, TRegistarData, TVerificationRequest } from "../types";

export class UserModule {
    static async login(request: TFastifyRequerst<TLoginData>, response: FastifyReply) {
        await errorHandlerModule(response, async () => {
            const jwtPair = await UserController.login(request.query)
            response.send({
                statusCode: 200,
                data: jwtPair
            }).status(200)
        })
    }

    static async register(request: TFastifyRequerst<TRegistarData>, response: FastifyReply) {
        await errorHandlerModule(response, async () => {
            await UserController.register(request.body)
            response.send({
                statusCode: 201
            }).status(201)
        })
    }

    static async loginForRefresh(request: TFastifyRequerst<undefined>, response: FastifyReply) {
        await errorHandlerModule(response, async () => {
            const refreshToken = request.headers.authorization;
            const jwtPair = await UserController.loginForRefresh(refreshToken)
            response.send({
                statusCode: 200,
                data: jwtPair
            }).status(200)
        })
    }

    static async removeUser(request: TFastifyRequerst<undefined>, response: FastifyReply) {
        await errorHandlerModule(response, async () => {
            await UserController.removeUser(request.userData.id)
            response.send({
                statusCode: 204
            }).status(204)
        })
    }

    static async verifiedUser(request: TFastifyRequerst<TVerificationRequest>, response: FastifyReply) {
        await errorHandlerModule(response, async () => {
            await UserController.verifiedUser(request.userData.id, request.body.verificationCode)
            response.send({
                statusCode: 201
            }).status(201)
        })
    }

    static async verificationReload(request: TFastifyRequerst<undefined>, response: FastifyReply) {
        await errorHandlerModule(response, async () => {
            await UserController.verificationReload(request.userData.id)
            response.send({
                statusCode: 201
            }).status(201)
        })
    }

    static async changeUserData(request: TFastifyRequerst<TChangeDataForUser>, response: FastifyReply) {
        await errorHandlerModule(response, async () => {
            await UserController.changeUserData(request.userData.id, request.body)
            response.send({
                statusCode: 201
            }).status(201)
        })
    }

    static async getUserData(request: TFastifyRequerst<undefined>, response: FastifyReply) {
        await errorHandlerModule(response, async () => {
            const userData = await UserController.getData(request.userData.id)
            response.send({
                statusCode: 200,
                data: userData
            }).status(200)
        })
    }

    static async getList(request: TFastifyRequerst<TListType>, response: FastifyReply) {
        await errorHandlerModule(response, async () => {
            if (request.params.listType == "events") {
                const list = await UserController.getList(request.userData.id, "events")
                response.send({
                    statusCode: 200,
                    data: list
                }).status(200)
            }
            else if (request.params.listType == "notes") {
                const list = await UserController.getList(request.userData.id, "notes")
                response.send({
                    statusCode: 200,
                    data: list
                }).status(200)
            }
        })
    }
}