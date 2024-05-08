import passwordHash from 'password-hash'

export class PasswordHesh {
    static generate(password:string):string {
        return passwordHash.generate(password, {});
    } 
    static verify(password:string, passwordhash:string):boolean {
        return passwordHash.verify(password, passwordhash)
    }
}