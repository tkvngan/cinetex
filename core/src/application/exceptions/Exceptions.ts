
export class AuthenticationRequiredException extends Error {
    constructor() {
        super("Authentication required");
    }
}

export class InvalidAuthenticationException extends Error {
    constructor() {
        super("Invalid authentication");
    }
}

export class UnauthorizedException extends Error {
    constructor() {
        super("Unauthorized");
    }
}
