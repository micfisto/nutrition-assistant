export class AppError extends globalThis.Error {
    constructor(code) {
        super(code);
        this.name = 'AppError';
        this.code = code;
    }
}