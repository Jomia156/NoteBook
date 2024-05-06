import Fastify from "fastify"
import logger from "./components/logger"
import { UserController } from "./controllers/controller.User"
import { AppConfig } from "./config"
import { FileController } from "./controllers/controller.File"
import multipart from "@fastify/multipart"
import routerUser from "./routers/router.User"


const app = Fastify({ logger })
app.register(multipart)

app.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body: string, done) {
    try {
        var json = JSON.parse(body)
        done(null, json)
    } catch (err) {
        err.statusCode = 400
        done(err, undefined)
    }
})

app.listen({ port: AppConfig.PORT, host: AppConfig.HOST }, function (err) {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
})


routerUser(app)

UserController.register({ name: "test1", email: "test1@test.ru", password: "qwqwqw123", login: "jomia" }).catch(err => {
    logger.debug({ status: err.status, code: err.code, message: err.message })
})


// import { test } from "./components/Colendar"
// test()
// app.get("/images/:filename", async (request: TFastifyRequerst<any>, reply) => {
//     try {
//         const fileData = await FileController.getFile(request.params.filename)
//         reply.type('image/png')
//         reply.send(fileData)
//     }  
//     catch (err) {
//         logger.error(err)
//     }
// })

app.post("/upload", async (req, res) => {
    const part = await req.file()
    let file = await part.toBuffer()
    let buffer = Buffer.from(file);
    const name = await FileController.uploadFile(buffer, part.filename)
    res.send(name || "OK")
})