var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import CustomError from "../components/CustomError";
import logger from "../components/logger";
export default function (reply, collback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield collback();
        }
        catch (err) {
            if (err instanceof CustomError) {
                reply.send({
                    statusCode: err.status,
                    descriptin: err.message,
                    code: err.code
                }).status(err.status);
            }
            else {
                logger.error(err);
                reply.send({
                    statusCode: 500,
                    descriptin: "Неожидання ошибка сервера",
                    code: "UNEXPECTION_ERROR"
                }).status(500);
            }
        }
    });
}
