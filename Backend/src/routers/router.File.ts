import { FastifyInstance } from "fastify";
import ModuleFile from "../modules/module.File";
import { authorization } from "../middlewares/middleware.authorization";

export default function (app: FastifyInstance) {
    app.route({
        method: 'GET',
        url: '/api/file/:filename',
        handler: ModuleFile.getFile
    })

    app.route({
        method: 'POST',
        url: '/api/file',
        schema: {
            headers: {
                type: "object",
                required: ["authorization"],
                properties: {
                    authorization: {
                        type: "string"
                    }
                }
            }
        },
        preHandler: authorization,
        handler: ModuleFile.uploadFile
    })
}