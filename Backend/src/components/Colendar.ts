import {TDateScritg, TTask } from "../types";
import CustomError from "./CustomError";
import { generateID } from "./generator";
import logger from "./logger";

export class Colendar {
    private colendar;

    constructor(colendarObj: object = {}) {
        this.colendar = colendarObj
    }

    appendTask(date: TDateScritg, task: TTask) {
        const dateArr = date.split(".")
        const dateDay = dateArr[0]
        const dateMonth = dateArr[1]
        const dateYear = dateArr[2]

        const taskId = generateID();

        if (!this.colendar[dateYear]) {
            this.colendar[dateYear] = {}
        }
        if (!this.colendar[dateYear][dateMonth]) {
            this.colendar[dateYear][dateMonth] = {}
        }
        if (!this.colendar[dateYear][dateMonth][dateDay]) {
            this.colendar[dateYear][dateMonth][dateDay] = {}
        }
        this.colendar[dateYear][dateMonth][dateDay][taskId] = { taskId, ...task }
    }

    removeTask(date: TDateScritg, taskId: string) {
        try {

            const dateArr = date.split(".")
            const dateDay = dateArr[0]
            const dateMonth = dateArr[1]
            const dateYear = dateArr[2]

            if (!this.colendar[dateYear]) {
                const message = "Task don`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_EXIST", 404, message)
            }
            if (!this.colendar[dateYear][dateMonth]) {
                const message = "Task don`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_EXIST", 404, message)
            }
            if (!this.colendar[dateYear][dateMonth][dateDay]) {
                const message = "Task don`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_EXIST", 404, message)
            }

            if (!this.colendar[dateYear][dateMonth][dateDay][taskId]) {
                const message = "Task don`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_EXIST", 404, message)
            }

            delete this.colendar[dateYear][dateMonth][dateDay][taskId]
            return
        }
        catch (err) {
            if (err instanceof CustomError) {
                throw err
            }
            else {
                logger.error(err)
                throw new CustomError("UNEXPECTION_ERROR", 500, "Неожидання ошибка сервера")
            }
        }
    }

    uploadTask(date:TDateScritg, newTask:TTask) {
        try {
            const dateArr = date.split(".")
            const dateDay = dateArr[0]
            const dateMonth = dateArr[1]
            const dateYear = dateArr[2]

            if (!this.colendar[dateYear]) {
                const message = "Task don`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_EXIST", 404, message)
            }
            if (!this.colendar[dateYear][dateMonth]) {
                const message = "Task don`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_EXIST", 404, message)
            }
            if (!this.colendar[dateYear][dateMonth][dateDay]) {
                const message = "Task don`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_EXIST", 404, message)
            }

            if (!this.colendar[dateYear][dateMonth][dateDay][newTask.taskId]) {
                const message = "Task don`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_EXIST", 404, message)
            }

            const neverTask = this.colendar[dateYear][dateMonth][dateDay][newTask.taskId]

            this.colendar[dateYear][dateMonth][dateDay][newTask.taskId] = {...neverTask, ...newTask}
            return
        }
        catch (err) {
            if (err instanceof CustomError) {
                throw err
            }
            else {
                logger.error(err)
                throw new CustomError("UNEXPECTION_ERROR", 500, "Неожидання ошибка сервера")
            }
        }
    }
    getColendar() {
        return this.colendar
    }
}

export function test() {   
    const a = new Colendar()
    a.appendTask("23.10.2022", {title:"test", description:"Test description"})
    a.appendTask("24.10.2021", {title:"test", description:"Test description"})
    a.appendTask("25.10.2024", {title:"test", description:"Test description"})
    return a.getColendar()
}