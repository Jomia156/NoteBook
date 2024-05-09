import { FastifyRequest } from "fastify"
import { ObjectId } from "mongodb"

export type TLoginData = {
    login: string
    password: string
}

export type TRegistarData = {
    name: string
    login: string
    password: string
    email: string
}

export type TJWTPair = {
    accessToken: string
    refreshToken: string
}

export type TJWTPayload = {
    id: string
    type: string
}

export type TMailConfig = {
    to: string
    subject?: string
    message: string
}

export type TChangeDataForUser = {
    name?: string,
    avatar?: string,
    password?: string,
    passwordHash?: string
}

export type TUserData = {
    _id: ObjectId,
    id: string
    login: string
    name: string
    email: string
    passwordHash: string
    avatar: string | null,
    verified: Boolean,
    notes: Array<string>,
    events: Array<string>,
    plans: Array<string>,
    schedules: Array<any>

}

export type TNoteData = {
    id?: string,
    ownerId?: string,
    title?: string,
    content: TNoteContent
}

export type TNoteContent = {
    type: "text" | "list",
    body: string
}

export type TSchuduleData = {
    date: TDateScritg,
    task: TTask
}

export type TTask = {
    date: TDateScritg,
    time: TTimeScritg
    taskId?: string
    title: string | null
    description: string | null
}

export type TTaskForUpdate = {
    date: TDateScritg,
    taskId: string
    description?: string | null
    title?: string | null
    time?: TTimeScritg
}

export type TDateScritg = `${number}${number}.${number}${number}.${number}${number}${number}${number}`
export type TTimeScritg = `${number}${number}:${number}${number}`



export type TFastifyRequerst<T> = FastifyRequest & {
    body: T,
    params: T,
    userData?: any,
    query: T,
    headers?: {
        authorization: string
    }
}

export type TListType = {
    listType: "events" | "notes"
}

export type TVerificationRequest = {
    verificationCode: string
}

export type TEventData = {
    _id: ObjectId,
    id: string
    userId: string
    title: string
    description: string
    date: string,
    time: string,
    geoposition: string,
    avatar: string | null,
    notes: Array<string>,
    plans: Array<string>,
}
export type TEventDataForCreated = {
    title: string,
    decription: string,
    date: string,
    time: string,
    geoposition: string
}