import {AppError} from "./AppError.js";

export class DomainError extends AppError {
    constructor(code) {
        super(code);
        this.name = 'DomainError';
    }
}