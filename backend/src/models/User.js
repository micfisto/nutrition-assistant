import {UserRole} from "../enums/UserRole.js";
import {UserStatus} from "../enums/UserStatus.js";
import {DomainError} from "../errors/DomainError.js";
import {UserErrors} from "../errors/UserErrors.js";
import validator from 'validator';

export class User {
    #id;
    #login;
    #username;
    #email;
    #passwordHash;
    #role;
    #status;
    #deactivatedAt;
    #updatedAt;

    static RECOVERY_PERIOD_DAYS = 30;

    static LOGIN_REGEX = /^[a-z0-9_-]+$/;
    static USERNAME_REGEX = /^[a-zа-яA-ZА-ЯёЁ0-9 _-]+$/;

    constructor(id, login, username, email, passwordHash, role = UserRole.USER, status = UserStatus.ACTIVE, deactivatedAt = null, updatedAt = null) {
        this.#id = id || crypto.randomUUID();
        this.#login = this.#validateLogin(login);
        this.#username = this.#validateUsername(username);
        this.#email = this.#validateEmail(email);
        this.#passwordHash = this.#validatePasswordHash(passwordHash);
        this.#role = role;
        this.#status = status;
        this.#deactivatedAt = deactivatedAt ? new Date(deactivatedAt) : null;
        this.#updatedAt = updatedAt ? new Date(updatedAt) : new Date();
    }

    static create({login, username, email, passwordHash, role = UserRole.USER}) {
        const id = crypto.randomUUID();
        const status = UserStatus.ACTIVE;
        const deactivatedAt = null;

        return new User(id, login, username, email, passwordHash, role, status, deactivatedAt);
    }

    static restore({id, login, username, email, passwordHash, role, status, deactivatedAt, updatedAt}) {
        if (!id)
            throw new DomainError(UserErrors.IdRequired);
        return new User(id, login, username, email, passwordHash, role, status, deactivatedAt, updatedAt);
    }

    get id() {
        return this.#id;
    }

    get login() {
        return this.#login;
    }

    get username() {
        return this.#username;
    }

    get email() {
        return this.#email;
    }

    get role() {
        return this.#role;
    }

    get status() {
        return this.#status;
    }

    get deactivatedAt() {
        return this.#deactivatedAt ? new Date(this.#deactivatedAt) : null;
    }

    get updatedAt() {
        return new Date(this.#updatedAt);
    }

    #touch() {
        this.#updatedAt = new Date();
    }

    changeLogin(newLogin) {
        this.#ensureIsActive();
        this.#login = this.#validateLogin(newLogin);
        this.#touch();
    }

    changePassword(newPasswordHash) {
        this.#ensureIsActive();
        this.#passwordHash = this.#validatePasswordHash(newPasswordHash);
        this.#touch();
    }

    changeEmail(newEmail) {
        this.#ensureIsActive();
        this.#email = this.#validateEmail(newEmail);
        this.#touch();
    }

    changeUsername(newUsername) {
        this.#ensureIsActive();
        this.#username = this.#validateUsername(newUsername);
        this.#touch();
    }

    deactivate() {
        if (this.#status !== UserStatus.ACTIVE)
            throw new DomainError(UserErrors.CannotBeDeactivated);

        this.#deactivatedAt = new Date();
        this.#status = UserStatus.DEACTIVATED;
        this.#touch();
    }

    recover() {
        if (this.#status !== UserStatus.DEACTIVATED || !this.#deactivatedAt)
            throw new DomainError(UserErrors.NotRecoverable);

        const now = new Date();
        const recoveryDeadline = new Date(this.#deactivatedAt);
        recoveryDeadline.setDate(recoveryDeadline.getDate() + User.RECOVERY_PERIOD_DAYS);

        if (now > recoveryDeadline)
            throw new DomainError(UserErrors.NotRecoverable);

        this.#deactivatedAt = null;
        this.#status = UserStatus.ACTIVE;

        this.#touch();
    }

    delete() {
        if (this.#status === UserStatus.DELETED)
            throw new DomainError(UserErrors.AlreadyDeleted);

        this.#anonymize();
        this.#status = UserStatus.DELETED;
        this.#deactivatedAt = null;
        this.#touch();
    }

    #anonymize() {
        const shortId = this.#id.replace(/-/g, '').slice(0, 8);

        this.#login = `delete_user_${shortId}`;
        this.#passwordHash = crypto.randomUUID().replace(/-/g, '');
        this.#email = `${shortId}@example.deleted`;
        this.#username = `delete_user_${shortId}`;
    }

    #ensureIsActive() {
        if (this.#status !== UserStatus.ACTIVE)
            throw new DomainError(UserErrors.NotActive);
    }

    #validateLogin(login) {
        if (!login || typeof login !== 'string')
            throw new DomainError(UserErrors.LoginEmpty);

        const trimmed = login.trim().toLowerCase();

        if (trimmed.length < 3)
            throw new DomainError(UserErrors.LoginTooShort);
        if (trimmed.length > 32)
            throw new DomainError(UserErrors.LoginTooLong);
        if (!User.LOGIN_REGEX.test(trimmed))
            throw new DomainError(UserErrors.InvalidLogin);

        return trimmed;
    }

    #validateUsername(username) {
        if (!username || typeof username !== 'string')
            throw new DomainError(UserErrors.UsernameEmpty);

        const normalized = username.trim().replace(/\s+/g, ' ');

        if (normalized.length < 3)
            throw new DomainError(UserErrors.UsernameTooShort);
        if (normalized.length > 50)
            throw new DomainError(UserErrors.UsernameTooLong);
        if (!User.USERNAME_REGEX.test(normalized))
            throw new DomainError(UserErrors.InvalidUsername);

        return normalized;
    }

    #validateEmail(email) {
        if (!email || typeof email !== 'string')
            throw new DomainError(UserErrors.EmailEmpty);

        const trimmed = email.trim().toLowerCase();
        if (trimmed.length > 254)
            throw new DomainError(UserErrors.EmailTooLong);

        if (!validator.isEmail(trimmed))
            throw new DomainError(UserErrors.InvalidEmail);

        return trimmed;
    }

    #validatePasswordHash(passwordHash) {
        if (!passwordHash || typeof passwordHash !== 'string')
            throw new DomainError(UserErrors.PasswordEmpty);

        return passwordHash;
    }
}