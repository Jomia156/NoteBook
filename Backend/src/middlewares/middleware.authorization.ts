
import { JWTController } from "../components/JWT.js";
import { TFastifyRequerst} from "../types.js";
import CustomError from "../components/CustomError.js";
import logger from "../components/logger.js";
import { FastifyReply } from "fastify";
import { UserController } from "../controllers/controller.User.js";

export const authorization = async (req: TFastifyRequerst<any>, reply:FastifyReply, done) => {
    try {
        if (req.headers.authorization) {
            await JWTController.getPayload(req.headers.authorization).then(async payload => {
                if (payload.type == "access") {
                    req.userData = await UserController.getData(payload.userId)
                    done()
                }
            })
        }
        return
    }
    catch (err) {
        if (err instanceof CustomError) {
            reply.send({
                status: err.status,
                description: err.message
            }).status(err.status)
        }
        else {
            logger.error(err)
            reply.send({
                status: 500,
                description: "Unexpected error"
            }).status(500)
        }
    }
}
