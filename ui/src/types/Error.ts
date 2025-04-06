export enum ErrorType {
    // Validation errors
    VALIDATION_ERROR = "VALIDATION_ERROR",
    REQUIRED_ERROR = "REQUIRED_ERROR",
    LENGTH_ERROR = "LENGTH_ERROR",
    FORMAT_ERROR = "FORMAT_ERROR",
    CONTENT_ERROR = "CONTENT_ERROR",

    // Authentication errors
    AUTH_ERROR = "AUTH_ERROR",
    UNAUTHORIZED_ERROR = "UNAUTHORIZED_ERROR",
    FORBIDDEN_ERROR = "FORBIDDEN_ERROR",

    // Database errors
    DB_ERROR = "DB_ERROR",
    NOT_FOUND_ERROR = "NOT_FOUND_ERROR",
    DUPLICATE_ERROR = "DUPLICATE_ERROR",

    // WebSocket errors
    WEBSOCKET_ERROR = "WEBSOCKET_ERROR",
    CONNECTION_ERROR = "CONNECTION_ERROR",
    RATE_LIMIT_ERROR = "RATE_LIMIT_ERROR",

    // System errors
    SYSTEM_ERROR = "SYSTEM_ERROR",
}

export interface AppError {
    type: ErrorType;
    code: number;
    message: string;
    field?: string;
}

export interface ValidationError extends AppError {
    type:
        | ErrorType.VALIDATION_ERROR
        | ErrorType.REQUIRED_ERROR
        | ErrorType.LENGTH_ERROR
        | ErrorType.FORMAT_ERROR
        | ErrorType.CONTENT_ERROR;
    field: string;
}

export interface AuthError extends AppError {
    type:
        | ErrorType.AUTH_ERROR
        | ErrorType.UNAUTHORIZED_ERROR
        | ErrorType.FORBIDDEN_ERROR;
}

export interface DBError extends AppError {
    type:
        | ErrorType.DB_ERROR
        | ErrorType.NOT_FOUND_ERROR
        | ErrorType.DUPLICATE_ERROR;
}

export interface WebSocketError extends AppError {
    type:
        | ErrorType.WEBSOCKET_ERROR
        | ErrorType.CONNECTION_ERROR
        | ErrorType.RATE_LIMIT_ERROR;
}

export interface SystemError extends AppError {
    type: ErrorType.SYSTEM_ERROR;
}

// Type guards
export function isValidationError(error: AppError): error is ValidationError {
    return [
        ErrorType.VALIDATION_ERROR,
        ErrorType.REQUIRED_ERROR,
        ErrorType.LENGTH_ERROR,
        ErrorType.FORMAT_ERROR,
        ErrorType.CONTENT_ERROR,
    ].includes(error.type);
}

export function isAuthError(error: AppError): error is AuthError {
    return [
        ErrorType.AUTH_ERROR,
        ErrorType.UNAUTHORIZED_ERROR,
        ErrorType.FORBIDDEN_ERROR,
    ].includes(error.type);
}

export function isDBError(error: AppError): error is DBError {
    return [
        ErrorType.DB_ERROR,
        ErrorType.NOT_FOUND_ERROR,
        ErrorType.DUPLICATE_ERROR,
    ].includes(error.type);
}

export function isWebSocketError(error: AppError): error is WebSocketError {
    return [
        ErrorType.WEBSOCKET_ERROR,
        ErrorType.CONNECTION_ERROR,
        ErrorType.RATE_LIMIT_ERROR,
    ].includes(error.type);
}

export function isSystemError(error: AppError): error is SystemError {
    return error.type === ErrorType.SYSTEM_ERROR;
}
