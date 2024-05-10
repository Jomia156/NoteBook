import { MongoClient, WithId, Document } from "mongodb";
import { TChangeDataForUser, TJWTPair, TLoginData, TRegistarData, TUserData } from "../types";
import { AppConfig } from "../config";
import { JWTController } from "../components/JWT";
import { generateID, generateVerifiCode } from "../components/generator";
import { PasswordHesh } from "../components/PasswordHash";
import logger from "../components/logger";
import CustomError from "../components/CustomError";
import MailController from "../components/MailController";
import { test } from "../components/Colendar";

import errorHandlerController from "../errorHendlers/errorHandler.Controller";

const mgClient = new MongoClient(AppConfig.mongoURL)

export class UserController {
    static async register(regData: TRegistarData): Promise<void> {
        return await errorHandlerController(async () => {
            const userData = {
                id: generateID(),
                login: regData.login,
                name: regData.name,
                email: regData.email,
                passwordHash: PasswordHesh.generate(regData.password),
                avatar: null,
                verified: false,
                notes: [],
                events: [],
                plans: [],
                schedules: { ...test() }
            }
            const verificationSession = {
                id: generateID(),
                userId: userData.id,
                createDateTime: Date.now(),
                code: generateVerifiCode()
            }

            await mgClient.connect()
            const db = mgClient.db("Notebook")
            const testEmailadnLogin = await db.collection("Users").findOne({ $or: [{ login: regData.login }, { email: regData.email }] })
            if (testEmailadnLogin) {
                let message = "Login or Email already exsist"
                logger.debug(message)
                throw new CustomError("DATA_EXISIT", 406, message)
            }
            await db.collection("Users").insertOne(userData)
            const session = await db.collection("Verifications").insertOne(verificationSession)
            setTimeout(async () => {
                await mgClient.connect()
                const db = mgClient.db("Notebook")
                await db.collection("Verifications").deleteOne({ _id: session.insertedId })
            }, AppConfig.verefiSessions_lifetime)

            MailController(regData.email, verificationSession.code)
            logger.debug("UserController.register -> OK")
            return
        })
    }

    static async login(loginData: TLoginData): Promise<TJWTPair> {

        return await errorHandlerController(async () => {
            await mgClient.connect()
            const db = mgClient.db("Notebook")
            const userData = await db.collection("Users").findOne({ login: loginData.login })
            if (!userData) {
                const message = "User don`t found"
                mgClient.close()
                logger.debug("UserController.login ->"+message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }
            if (PasswordHesh.verify(loginData.password, userData.passwordHash)) {
                logger.debug("UserController.login -> OK")
                return await JWTController.create(userData.id)
            }
            else {
                const message = "User don`t found"
                mgClient.close()
                logger.debug("UserController.login ->"+message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }
        })
    }

    static async loginForRefresh(refreshToken: string): Promise<TJWTPair> {
        return await errorHandlerController(async () => {
            const payload = await JWTController.getPayload(refreshToken)

            await mgClient.connect()
            const db = mgClient.db("Notebook")
            const userData = await db.collection("Users").findOne({ id: payload.id })
            if (!userData) {
                const message = "User don`t found"
                mgClient.close()
                logger.debug("UserController.loginForRefresh ->"+message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }
            logger.debug("UserController.loginForRefresh -> OK")
            return await JWTController.create(payload.id)
        })
    }

    static async removeUser(userId: string): Promise<void> {
        return await errorHandlerController(async () => {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const userData = await db.collection("Users").findOne({ id: userId })

            if (!userData) {
                const message = "User don`t found"
                mgClient.close()
                logger.debug("UserController.removeUser ->"+message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }

            await db.collection("Users").deleteOne({ _id: userData._id })
            logger.debug("UserController.removeUser -> OK")
            return
        })
    }

    static async verifiedUser(userId: string, verifiCode: string): Promise<void> {
        return await errorHandlerController(async () => {
            mgClient.connect()
            const db = mgClient.db("Notebook")

            const userData = await db.collection("Users").findOne({ id: userId })
            if (!userData) {
                const message = "User don`t found"
                mgClient.close()
                logger.debug("UserController.verifiedUser ->"+message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }
            const verificationSession = await db.collection("Verifications").findOne({ userId: userId })
            if (!verificationSession) {
                const message = "Session don`t found"
                mgClient.close()
                logger.debug("UserController.verifiedUser ->"+message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }

            if (verificationSession.code == verifiCode) {
                await db.collection("Users").updateOne({ id: userId }, { verified: true })
                await db.collection("Verifications").deleteOne({ _id: verificationSession._id })

                mgClient.close()
                logger.debug("UserController.verifiedUser -> OK")
                return
            }
            const message = "User don`t confirmed"
            mgClient.close()
            logger.debug("UserController.verifiedUser ->"+message)
            throw new CustomError("USER_DONT_CONFIRM", 422, message)
        })
    }

    static async verificationReload(userId: string): Promise<void> {
        return await errorHandlerController(async () => {
            mgClient.connect()
            const db = mgClient.db("Notebook")

            const userData = await db.collection("User").findOne({ id: userId })
            if (!userData) {
                const message = "User don`t found"
                mgClient.close()
                logger.debug("UserController.verificationReload ->"+message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }

            const verificationSession = await db.collection("Verifications").findOne({ userId })
            const newVerifiCode = generateVerifiCode()
            if (verificationSession) {
                await db.collection("Verifications").updateOne({ userId }, { code: newVerifiCode })
            }
            else {
                const verificationSession = {
                    id: generateID(),
                    userId,
                    createDateTime: Date.now(),
                    code: generateVerifiCode()
                }
                const session = await db.collection("Verifications").insertOne(verificationSession)
                setTimeout(async () => {
                    await mgClient.connect()
                    const db = mgClient.db("Notebook")
                    await db.collection("Verifications").deleteOne({ _id: session.insertedId })
                }, AppConfig.verefiSessions_lifetime)

                MailController(userData.email, verificationSession.code)
            }
            mgClient.close()
            logger.info("Verification seesion has been upload")
            return
        })
    }

    static async changeUserData(userId: string, newData: TChangeDataForUser): Promise<void> {
        return await errorHandlerController(async () => {
            mgClient.connect()
            const db = mgClient.db("Notebook")

            const userData = await db.collection("User").findOne({ id: userId })
            if (!userData) {
                const message = "User don`t found"
                mgClient.close()
                logger.debug("UserController.changeUserData ->"+message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }
            let changeData: TChangeDataForUser = {}
            if (newData.password) {
                changeData.passwordHash = PasswordHesh.generate(newData.password)
            }
            else {
                changeData = { ...newData }
            }
            await db.collection("Users").updateOne({ _id: userData._id }, { changeData })
            
            mgClient.close()
            logger.info("UserController.changeUserData -> OK")
            return
        })
    }

    static async getData(userId: string): Promise<WithId<Document>> {
        return await errorHandlerController(async ()=>{
            mgClient.connect()
            const db = mgClient.db("Notebook")

            const userData = await db.collection("Users").findOne({ id: userId })
            if (!userData) {
                const message = "User don`t found"
                mgClient.close()
                logger.debug("UserController.getData ->"+message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }

            mgClient.close()
            logger.info("UserController.getData -> OK")
            return userData
        })
    }

    static async getList(userId: string, listName: string): Promise<Array<string>> {
        return await errorHandlerController(async ()=>{
            mgClient.connect()
            const db = mgClient.db("Notebook")

            const userData = await db.collection("Users").findOne({ id: userId })
            if (!userData) {
                const message = "User don`t found"
                mgClient.close()
                logger.debug("UserController.getList ->"+message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }

            mgClient.close()
            logger.info("UserController.getList -> OK")
            return userData[listName]
        })
    }
}

