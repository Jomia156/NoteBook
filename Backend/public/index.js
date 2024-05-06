var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Fastify from "fastify";
import logger from "./components/logger";
import { UserController } from "./controllers/controller.User";
import { AppConfig } from "./config";
import { FileController } from "./controllers/controller.File";
import multipart from "@fastify/multipart";
import routerUser from "./routers/router.User";
const app = Fastify({ logger });
app.register(multipart);
app.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
    try {
        var json = JSON.parse(body);
        done(null, json);
    }
    catch (err) {
        err.statusCode = 400;
        done(err, undefined);
    }
});
app.listen({ port: AppConfig.PORT, host: AppConfig.HOST }, function (err) {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
});
routerUser(app);
UserController.register({ name: "test1", email: "test1@test.ru", password: "qwqwqw123", login: "jomia" }).catch(err => {
    logger.debug({ status: err.status, code: err.code, message: err.message });
});
app.post("/upload", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const part = yield req.file();
    let file = yield part.toBuffer();
    let buffer = Buffer.from(file);
    const name = yield FileController.uploadFile(buffer, part.filename);
    res.send(name || "OK");
}));
