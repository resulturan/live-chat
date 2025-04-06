export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const validateUsername = (username: string): ValidationResult => {
    if (!username) {
        return { isValid: false, error: "Username is required" };
    }

    if (username.length < 3) {
        return {
            isValid: false,
            error: "Username must be at least 3 characters long",
        };
    }

    if (username.length > 20) {
        return {
            isValid: false,
            error: "Username must be less than 20 characters long",
        };
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        return {
            isValid: false,
            error: "Username can only contain letters, numbers, underscores, and hyphens",
        };
    }

    return { isValid: true };
};

export const validateMessage = (message: string): ValidationResult => {
    if (!message) {
        return { isValid: false, error: "Message is required" };
    }

    if (message.length > 1000) {
        return {
            isValid: false,
            error: "Message must be less than 1000 characters long",
        };
    }

    // Check for potentially harmful content
    const harmfulPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
        /javascript:/gi, // JavaScript protocol
        /data:/gi, // Data protocol
        /vbscript:/gi, // VBScript protocol
    ];

    for (const pattern of harmfulPatterns) {
        if (pattern.test(message)) {
            return {
                isValid: false,
                error: "Message contains potentially harmful content",
            };
        }
    }

    return { isValid: true };
};
