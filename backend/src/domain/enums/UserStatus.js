export class UserStatus{
    static ACTIVE = 'ACTIVE';
    static DEACTIVATED = 'DEACTIVATED';
    static DELETED = 'DELETED';

    static isValid(value){
        return Object.values(this).includes(value);
    }
}