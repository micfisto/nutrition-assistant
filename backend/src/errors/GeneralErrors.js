export class GeneralErrors {
    // Find and exist entities
    static NotFound = 'NOT_FOUND';
    static AlreadyExists = 'ALREADY_EXISTS';

    // Access and auth
    static Unauthorized = 'UNAUTHORIZED';
    static Forbidden = 'FORBIDDEN';

    // Server/DB errors
    static InternalError = 'INTERNAL_ERROR';
    static DatabaseError = 'DATABASE_ERROR';
}