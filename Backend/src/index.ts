import Fastify from "fastify"
import logger from "./components/logger"
import {UserController} from "./controllers/controller.User"
import { AppConfig } from "./config"
import s3 from "s3"

const app = Fastify({ logger })

app.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body:string, done) {
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

UserController.register({name:"test1", email:"test1@test.ru", password:"qwqwqw123", login:"jjj11"}).catch(err=>{
    logger.debug({status:err.status, code:err.code, message:err.message})
})


// import { test } from "./components/Colendar"
// test()