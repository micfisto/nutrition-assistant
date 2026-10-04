export class UserUpdateDto {
    constructor(payload = {}) {
        this.login = payload.login !== undefined ? payload.login : undefined;
        this.username = payload.username !== undefined ? payload.username : undefined;
        this.email = payload.email !== undefined ? payload.email : undefined;
        this.password = payload.password !== undefined ? payload.password : undefined;
    }
}