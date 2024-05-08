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

const mgClient = new MongoClient(AppConfig.mongoURL)

export class UserController {
    static async register(regData: TRegistarData): Promise<void> {
        try {
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
                schedules: {...test()}
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
                await db.collection("Verifications").deleteOne({_id:session.insertedId})
            }, AppConfig.verefiSessions_lifetime)

            MailController(regData.email, verificationSession.code)
            logger.info("Register complete")
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
        finally {
            mgClient.close()
        }
    }

    static async login(loginData: TLoginData): Promise<TJWTPair> {
        try {
            await mgClient.connect()
            const db = mgClient.db("Notebook")
            const userData = await db.collection("Users").findOne({ login: loginData.login })
            if (!userData) {
                const message = "User don`t found1"
                logger.debug(message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }
            if (PasswordHesh.verify(loginData.password, userData.passwordHash)) {
                return await JWTController.create(userData.id)
            }
            else {
                const message = "User don`t found2"
                logger.debug(message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }
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
        finally {
            mgClient.close()
        }
    }

    static async loginForRefresh(refreshToken: string): Promise<TJWTPair> {
        try {
            const payload = await JWTController.getPayload(refreshToken)

            await mgClient.connect()
            const db = mgClient.db("Notebook")
            const userData = await db.collection("Users").findOne({ id: payload.id })
            if (!userData) {
                const message = "User don`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }

            return await JWTController.create(payload.id)
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
        finally {
            mgClient.close()
        }
    }

    static async removeUser(userId: string): Promise<void> {
        try {
            await mgClient.connect()
            const db = mgClient.db("Notebook")

            const userData = await db.collection("Users").findOne({ id: userId })

            if (!userData) {
                const message = "User don`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }

            await db.collection("Users").deleteOne({ _id: userData._id })
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
        finally {
            mgClient.close()
        }
    }

    static async verifiedUser(userId: string, verifiCode: string): Promise<void> {
        try {
            mgClient.connect()
            const db = mgClient.db("Notebook")

            const userData = await db.collection("Users").findOne({ id: userId })
            if (!userData) {
                const message = "User don`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }
            const verificationSession = await db.collection("Verifications").findOne({ userId: userId })
            if (!verificationSession) {
                const message = "Session don`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }

            if (verificationSession.code == verifiCode) {
                await db.collection("Users").updateOne({ id: userId }, { verified: true })
                await db.collection("Verifications").deleteOne({ _id: verificationSession._id })

                const message = "User has been confirmed"
                logger.debug(message)
                return
            }
            const message = "User don`t confirmed"
            logger.debug(message)
            throw new CustomError("USER_DONT_CONFIRM", 422, message)
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
        finally {
            mgClient.close()
        }
    }

    static async verificationReload(userId:string):Promise<void> {
        try {
            mgClient.connect()
            const db = mgClient.db("Notebook")

            const userData = await db.collection("User").findOne({id:userId})
            if (!userData) {
                const message = "User don`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }

            const verificationSession = await db.collection("Verifications").findOne({userId})
            const newVerifiCode = generateVerifiCode()
            if (verificationSession) {
                await db.collection("Verifications").updateOne({userId}, {code:newVerifiCode})
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
                    await db.collection("Verifications").deleteOne({_id:session.insertedId})
                }, AppConfig.verefiSessions_lifetime)
    
                MailController(userData.email, verificationSession.code)
            }

            logger.info("Verification seesion has been upload")
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
        finally {
            mgClient.close()
        }
    }

    static async changeUserData(userId:string, newData:TChangeDataForUser):Promise<void> {
        try {
            mgClient.connect()
            const db = mgClient.db("Notebook")

            const userData = await db.collection("User").findOne({id:userId})
            if (!userData) {
                const message = "User don`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            }
            let changeData:TChangeDataForUser = {}
            if (newData.password) {
                changeData.passwordHash = passwordHash.generate(newData.password)
            }
            else {
                changeData = {...newData}
            }
            await db.collection("Users").updateOne({_id:userData._id}, {changeData})
            logger.info("User data has been update")
            return
        }
        catch(err) {
            if (err instanceof CustomError) {
                throw err
            }
            else {
                logger.error(err)
                throw new CustomError("UNEXPECTION_ERROR", 500, "Неожидання ошибка сервера")
            }
        }
        finally {
            mgClient.close()
        }
    }

    static async getData(userId:string):Promise<WithId<Document>> { 
        try {
            mgClient.connect()
            const db = mgClient.db("Notebook")

            const userData = await db.collection("Users").findOne({id:userId})
            if (!userData) {
                const message = "User don`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            } 
            logger.info("User data has been received")
            return userData
        }
        catch(err) {
            if (err instanceof CustomError) {
                throw err
            }
            else {
                logger.error(err)
                throw new CustomError("UNEXPECTION_ERROR", 500, "Неожидання ошибка сервера")
            }
        }
        finally {
            mgClient.close()
        }   
    }

    static async getList(userId:string, listName:string):Promise<Array<string>> {
        try {
            mgClient.connect()
            const db = mgClient.db("Notebook")

            const userData = await db.collection("Users").findOne({id:userId})
            if (!userData) {
                const message = "User don`t found"
                logger.debug(message)
                throw new CustomError("DATA_DONT_FOUND", 404, message)
            } 
            logger.info("List of data has been received")
            return userData[listName]
        }
        catch(err) {
            if (err instanceof CustomError) {
                throw err
            }
            else {
                logger.error(err)
                throw new CustomError("UNEXPECTION_ERROR", 500, "Неожидання ошибка сервера")
            }
        }
        finally {
            mgClient.close()
        }   
    }
}

