export class UserRole {
    static USER = 'USER';
    static ADMIN = 'ADMIN';

    static isValid(value) {
        return Object.values(this).includes(value);
    }
}