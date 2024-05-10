import Fastify, { FastifyReply } from "fastify"
import logger from "./components/logger"
import { AppConfig } from "./config"
import multipart from "@fastify/multipart"

import routerUser from "./routers/router.User"
import routerFile from "./routers/router.File"
import routerEvent from "./routers/router.Event"
import routerSchedules from "./routers/router.Schedules"
import routerNote from "./routers/router.Note"

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
routerFile(app)
routerNote(app)
routerEvent(app)
routerSchedules(app)
