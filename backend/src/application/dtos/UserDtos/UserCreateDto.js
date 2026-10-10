export class UserCreateDto{
    constructor(payload = {}) {
        this.login = payload.login;
        this.username = payload.username;
        this.email = payload.email;
        this.password = payload.password;
    }
}