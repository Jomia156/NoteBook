import errHandler from "../components/errorHendler_Controller.js"
import CustomError from "../components/customError"
import quertyString from "../components/quertyString.js"

export default class SchedulesController {
    static async getForMonth(date) {
        return await errHandler(async () => {
            const { statusCode, data, descriptin } = await fetch("/api/user/schedules?" + quertyString({ date }), { headers: { Authorization: window.localStorage.accessToken } }).then(data => data.json());
            if (statusCode == 200) {
                return data
            }
            throw new CustomError(descriptin)
        })
    }

    static async getById(data, taskId) {
        return await errHandler(async () => {
            const { statusCode, data, descriptin } = await fetch("/api/user/schedules/task/taskId?" + quertyString({ date }), { headers: { Authorization: window.localStorage.accessToken } }).then(data => data.json())
            if (statusCode == 200) {
                return data
            }
            throw new CustomError(descriptin)
        })
    }

    static async createTask(taskData) {
        return await errHandler(async ()=>{
            const {statusCode, data, descriptin} = await fetch("/api/user/schedules/task", {method:"POST", headers: {Authorization:window.localStorage.accessToken}, body:JSON.stringify(taskData)}).then(data=>data.json())
            if (statusCode == 201) {
                return true
            }
            throw new CustomError(descriptin)
        })
    }

    static async removeTask(date, taskId) {
        return await errHandler(async ()=>{
            const {statusCode, data, descriptin} = await fetch("/api/user/schedules/task/"+taskId+"?"+quertyString({date}), {method:"DELETE", headers: {Authorization:window.localStorage.accessToken}, body:JSON.stringify(taskId)}).then(data=>data.json())
            if (statusCode == 201) {
                return true
            }
            throw new CustomError(descriptin)
        })
    }

    static async changeTask(date, taskId, newTaskData) {
        return await errHandler(async ()=>{
            const {statusCode, data, descriptin} = await fetch("/api/user/schedules/task/"+taskId+"?"+quertyString({date}), {method:"PUT", headers: {Authorization:window.localStorage.accessToken}, body: JSON.stringify(newTaskData)})
            if (statusCode == 201) {
                return true
            }
            throw new CustomError(descriptin)
        })
    }


}