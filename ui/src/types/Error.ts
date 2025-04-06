export type ErrorType =
    | "VALIDATION_ERROR"
    | "REQUIRED_ERROR"
    | "LENGTH_ERROR"
    | "FORMAT_ERROR"
    | "CONTENT_ERROR"
    | "AUTHENTICATION_ERROR"
    | "UNAUTHORIZED_ERROR"
    | "DATABASE_ERROR"
    | "DUPLICATE_ERROR"
    | "NOT_FOUND_ERROR"
    | "WEBSOCKET_ERROR"
    | "CONNECTION_ERROR"
    | "SYSTEM_ERROR";

export interface AppError {
    type: ErrorType;
    code: number;
    message: string;
    field?: string;
}

export interface ValidationError extends AppError {
    type:
        | "VALIDATION_ERROR"
        | "REQUIRED_ERROR"
        | "LENGTH_ERROR"
        | "FORMAT_ERROR"
        | "CONTENT_ERROR";
    field: string;
}

export interface AuthError extends AppError {
    type: "AUTHENTICATION_ERROR" | "UNAUTHORIZED_ERROR";
}

export interface DBError extends AppError {
    type: "DATABASE_ERROR" | "DUPLICATE_ERROR" | "NOT_FOUND_ERROR";
}

export interface WebSocketError extends AppError {
    type: "WEBSOCKET_ERROR" | "CONNECTION_ERROR";
}

export interface SystemError extends AppError {
    type: "SYSTEM_ERROR";
}

export function isValidationError(error: AppError): error is ValidationError {
    return [
        "VALIDATION_ERROR",
        "REQUIRED_ERROR",
        "LENGTH_ERROR",
        "FORMAT_ERROR",
        "CONTENT_ERROR",
    ].includes(error.type);
}

export function isAuthError(error: AppError): error is AuthError {
    return ["AUTHENTICATION_ERROR", "UNAUTHORIZED_ERROR"].includes(error.type);
}

export function isDBError(error: AppError): error is DBError {
    return ["DATABASE_ERROR", "DUPLICATE_ERROR", "NOT_FOUND_ERROR"].includes(
        error.type
    );
}

export function isWebSocketError(error: AppError): error is WebSocketError {
    return ["WEBSOCKET_ERROR", "CONNECTION_ERROR"].includes(error.type);
}

export function isSystemError(error: AppError): error is SystemError {
    return error.type === "SYSTEM_ERROR";
}
