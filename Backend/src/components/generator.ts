export const generateID = (): string => {
    return "id" + Math.random().toString(16).slice(2)
}

export const generateVerifiCode = (): string => {
    return Math.random().toString(16).slice(2)
}
