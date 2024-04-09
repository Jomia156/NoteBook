import nodemailer from "nodemailer";
import logger from "./logger";
import CustomError from "./CustomError";
import { AppConfig } from "../config";
let config = {
    host: AppConfig.IMAPServer,
    port: AppConfig.IMAPPort,
    secure: false,
    auth: {
        user: AppConfig.mail_user,
        pass: AppConfig.mail_password,
    },
};
let email = nodemailer.createTransport(config);
export default (to, verifiCode) => {
    email.sendMail({
        from: `"TimeMeneger" <${config.auth.user}>`,
        to: to,
        subject: 'Подтверждение аккаунта TimeMeneger',
        html: `Здравствуйте!
            <br>
        Ваш код подтверждения: <b>${verifiCode}</b>.
        <br>
        Введите этот код на странице сайта, для подтверждения вашего аккаунта.
        <br>
        Данный код работает всего 10 минут.
        <br>
        Если у вас есть какие-либо вопросы, отправьте нам электронное письмо на почту <b>time.meneger@ro.ru</b>. 
        <br>
        Мы рады, что вы с нами!
        -TimeMeneger Team`,
    }).then(() => {
        logger.info("Message send");
    }).catch(err => {
        logger.error(err);
        throw new CustomError("UNEXPECTION_ERROR", 500, "Неожидання ошибка сервера");
    });
};
