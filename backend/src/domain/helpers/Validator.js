import { DomainError } from "../errors/DomainError.js";

export class Validator {
    static string(value, { emptyError, minLength, shortError, maxLength, longError, regex, regexError, collapseSpaces = true }) {
        if (!value || typeof value !== 'string' || !value.trim()) {
            throw new DomainError(emptyError);
        }

        let result = value.trim();
        if (collapseSpaces) {
            result = result.replace(/\s+/g, ' ');
        }

        if (minLength && result.length < minLength) {
            throw new DomainError(shortError);
        }
        if (maxLength && result.length > maxLength) {
            throw new DomainError(longError);
        }
        if (regex && !regex.test(result)) {
            throw new DomainError(regexError);
        }

        return result;
    }

    static number(value, { min = 0, max = Infinity, errorKey }) {
        if (typeof value !== 'number' || isNaN(value) || value < min || value > max) {
            throw new DomainError(errorKey);
        }
        return value;
    }

    static enum(value, enumObject, errorKey) {
        if (!Object.values(enumObject).includes(value)) {
            throw new DomainError(errorKey);
        }
        return value;
    }

    static instanceOf(object, expectedClass, errorKey) {
        if (!(object instanceof expectedClass)) {
            throw new DomainError(errorKey);
        }
        return object;
    }
}