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
    notes: Array<string>[],
    events: Array<string>,
    plans: Array<string>,
    schedules: Array<any>

}

export type TNoteData = {
    id?: string,
    userId?: string,
    title?: string,
    content: TNoteContent
}

export type TNoteContent = {
    type: "text" | "list",
    body: string
}