export class UserResponseDto {
    constructor(user) {
        this.id = user.id;
        this.login = user.login;
        this.username = user.username;
        this.email = user.email;
        this.role = user.role;
        this.status = user.status;
        this.deactivatedAt = user.deactivatedAt;
    }
}