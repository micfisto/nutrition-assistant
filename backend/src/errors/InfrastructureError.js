import {AppError} from "./AppError.js";

export class InfrastructureError extends AppError {
    constructor(code = 'INTERNAL_SERVER_ERROR', originalError = null) {
        super(code);
        this.name = 'InfrastructureError';
        this.originalError = originalError;
    }
}