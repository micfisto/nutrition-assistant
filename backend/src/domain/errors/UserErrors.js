export class UserErrors {
    static LoginEmpty = 'USER_LOGIN_EMPTY';
    static LoginTooShort = 'USER_LOGIN_TOO_SHORT';
    static LoginTooLong = 'USER_LOGIN_TOO_LONG';
    static InvalidLogin = 'USER_INVALID_LOGIN';

    static UsernameEmpty = 'USER_USERNAME_EMPTY';
    static UsernameTooShort = 'USER_USERNAME_TOO_SHORT';
    static UsernameTooLong = 'USER_USERNAME_TOO_LONG';
    static InvalidUsername = 'USER_INVALID_USERNAME';

    static EmailEmpty = 'USER_EMAIL_EMPTY';
    static EmailTooLong = 'USER_EMAIL_TOO_LONG';
    static InvalidEmail = 'USER_INVALID_EMAIL';

    static PasswordEmpty = 'USER_PASSWORD_EMPTY';

    static NotActive = 'USER_NOT_ACTIVE';
    static CannotBeDeactivated = 'USER_CANNOT_BE_DEACTIVATED';
    static NotRecoverable = 'USER_NOT_RECOVERABLE';
    static AlreadyDeleted = 'USER_ALREADY_DELETED';
    static IdRequired = 'USER_ID_REQUIRED';
}