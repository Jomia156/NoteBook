export const generateID = () => {
    return "id" + Math.random().toString(16).slice(2);
};
export const generateVerifiCode = () => {
    return Math.random().toString(16).slice(2);
};
