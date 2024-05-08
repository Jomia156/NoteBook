import passwordHash from 'password-hash';
export class PasswordHesh {
    static generate(password) {
        return passwordHash.generate(password, {});
    }
    static verify(password, passwordhash) {
        return passwordHash.verify(password, passwordhash);
    }
}
