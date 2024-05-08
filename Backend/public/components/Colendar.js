import CustomError from "./CustomError";
import { generateID } from "./generator";
import logger from "./logger";
export class Colendar {
    constructor(colendarObj = {}) {
        this.colendar = colendarObj;
    }
    appendTask(date, task) {
        const dateArr = date.split(".");
        const dateDay = dateArr[0];
        const dateMonth = dateArr[1];
        const dateYear = dateArr[2];
        const taskId = generateID();
        if (!this.colendar[dateYear]) {
            this.colendar[dateYear] = {};
        }
        if (!this.colendar[dateYear][dateMonth]) {
            this.colendar[dateYear][dateMonth] = {};
        }
        if (!this.colendar[dateYear][dateMonth][dateDay]) {
            this.colendar[dateYear][dateMonth][dateDay] = {};
        }
        this.colendar[dateYear][dateMonth][dateDay][taskId] = Object.assign({ taskId }, task);
    }
    removeTask(date, taskId) {
        try {
            const dateArr = date.split(".");
            const dateDay = dateArr[0];
            const dateMonth = dateArr[1];
            const dateYear = dateArr[2];
            if (!this.colendar[dateYear]) {
                const message = "Task don`t found";
                logger.debug(message);
                throw new CustomError("DATA_DONT_EXIST", 404, message);
            }
            if (!this.colendar[dateYear][dateMonth]) {
                const message = "Task don`t found";
                logger.debug(message);
                throw new CustomError("DATA_DONT_EXIST", 404, message);
            }
            if (!this.colendar[dateYear][dateMonth][dateDay]) {
                const message = "Task don`t found";
                logger.debug(message);
                throw new CustomError("DATA_DONT_EXIST", 404, message);
            }
            if (!this.colendar[dateYear][dateMonth][dateDay][taskId]) {
                const message = "Task don`t found";
                logger.debug(message);
                throw new CustomError("DATA_DONT_EXIST", 404, message);
            }
            delete this.colendar[dateYear][dateMonth][dateDay][taskId];
            return;
        }
        catch (err) {
            if (err instanceof CustomError) {
                throw err;
            }
            else {
                logger.error(err);
                throw new CustomError("UNEXPECTION_ERROR", 500, "Неожидання ошибка сервера");
            }
        }
    }
    uploadTask(date, newTask) {
        try {
            const dateArr = date.split(".");
            const dateDay = dateArr[0];
            const dateMonth = dateArr[1];
            const dateYear = dateArr[2];
            if (!this.colendar[dateYear]) {
                const message = "Task don`t found";
                logger.debug(message);
                throw new CustomError("DATA_DONT_EXIST", 404, message);
            }
            if (!this.colendar[dateYear][dateMonth]) {
                const message = "Task don`t found";
                logger.debug(message);
                throw new CustomError("DATA_DONT_EXIST", 404, message);
            }
            if (!this.colendar[dateYear][dateMonth][dateDay]) {
                const message = "Task don`t found";
                logger.debug(message);
                throw new CustomError("DATA_DONT_EXIST", 404, message);
            }
            if (!this.colendar[dateYear][dateMonth][dateDay][newTask.taskId]) {
                const message = "Task don`t found";
                logger.debug(message);
                throw new CustomError("DATA_DONT_EXIST", 404, message);
            }
            const neverTask = this.colendar[dateYear][dateMonth][dateDay][newTask.taskId];
            this.colendar[dateYear][dateMonth][dateDay][newTask.taskId] = Object.assign(Object.assign({}, neverTask), newTask);
            return;
        }
        catch (err) {
            if (err instanceof CustomError) {
                throw err;
            }
            else {
                logger.error(err);
                throw new CustomError("UNEXPECTION_ERROR", 500, "Неожидання ошибка сервера");
            }
        }
    }
    getColendar() {
        return this.colendar;
    }
    getColendarFromMonth(date) {
        try {
            const dateArr = date.split(".");
            const dateMonth = dateArr[0];
            const dateYear = dateArr[1];
            if (!this.colendar[dateYear]) {
                return {};
            }
            if (!this.colendar[dateYear][dateMonth]) {
                return {};
            }
            return this.colendar[dateYear][dateMonth];
        }
        catch (err) {
            if (err instanceof CustomError) {
                throw err;
            }
            else {
                logger.error(err);
                throw new CustomError("UNEXPECTION_ERROR", 500, "Неожидання ошибка сервера");
            }
        }
    }
}
export function test() {
    const a = new Colendar();
    a.appendTask("23.10.2022", { title: "test", description: "Test description" });
    a.appendTask("24.10.2021", { title: "test", description: "Test description" });
    a.appendTask("25.10.2024", { title: "test", description: "Test description" });
    return a.getColendar();
}
