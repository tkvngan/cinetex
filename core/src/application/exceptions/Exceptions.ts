
export abstract class ApplicationException extends Error {
    protected constructor(message?: string) {
        super(message);
    }
    get name() {
        return this.constructor.name;
    }
    toString() {
        return this.name + ": " + this.message;
    }
    toJSON() {
        return {
            exception: {
                name: this.name,
                message: this.message
            }
        }
    }
}

export abstract class AuthenticationException extends ApplicationException {
    protected constructor(message?: string) {
        super(message);
    }
}

export abstract class AuthorizationException extends ApplicationException {
    protected constructor(message?: string) {
        super(message);
    }
}

export class AuthenticationRequiredException extends AuthenticationException {
    constructor(message?: string) {
        super(message);
    }
}

export class InvalidAuthenticationException extends AuthenticationException {
    constructor(message?: string) {
        super(message);
    }
}

export class UnauthorizedException extends AuthorizationException {
    constructor(message?: string) {
        super(message);
    }
}

export class UserAlreadyExistsException extends ApplicationException {
    constructor(message?: string) {
        super(message);
    }
}

export class UserNotFoundException extends ApplicationException {
    constructor(message?: string) {
        super(message);
    }
}

export class InvalidPasswordException extends ApplicationException {
    constructor(message?: string) {
        super(message);
    }
}

export function toException(value: any): Error {
    if (value && value.exception) {
        const exception = value.exception;
        switch (exception.name) {
            case AuthenticationRequiredException.name:
                return new AuthenticationRequiredException(exception.message);
            case InvalidAuthenticationException.name:
                return new InvalidAuthenticationException(exception.message);
            case UnauthorizedException.name:
                return new UnauthorizedException(exception.message);
            case UserNotFoundException.name:
                return new UserNotFoundException(exception.message);
            case InvalidPasswordException.name:
                return new InvalidPasswordException(exception.message);
            case UserAlreadyExistsException.name:
                return new UserAlreadyExistsException(exception.message);
        }
        if (exception.name) {
            return new Error(`${exception.name}: ${exception.message}`);
        } else {
            return new Error(exception.message);
        }
    }
    if (value !== undefined && value !== null) {
        return new Error(value.toString());
    } else {
        return new Error("Unknown exception");
    }
}
