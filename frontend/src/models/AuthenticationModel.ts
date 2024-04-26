import {Credentials} from "cinetex-core/dist/security/Credentials";
import {SignIn, SignUp, SignUpRequest} from "cinetex-core/dist/application/requests";
import {ViewModel} from "./ViewModel";

export interface SignInIntent {
    readonly action: 'signIn'
    readonly email: string
    readonly password: string
}

export interface SignUpIntent extends SignUpRequest {
    readonly action: 'signUp'
}

export interface SignOutIntent {
    readonly action: 'signOut'
}

export type AuthenticationState = {
    readonly isAuthenticated: true
    readonly credentials: Credentials
} | {
    readonly isAuthenticated: false
    readonly credentials?: undefined
}

export class AuthenticationModel extends ViewModel<AuthenticationState, SignInIntent | SignOutIntent | SignUpIntent> {

    public constructor(readonly signInUseCase: SignIn, readonly signUpUseCase: SignUp) {
        super({ isAuthenticated: false });
    }

    public async handle(intent: SignInIntent | SignOutIntent | SignUpIntent): Promise<void> {
        switch (intent.action) {
            case 'signIn':
                return this.signIn(intent)
            case 'signUp':
                return this.signUp(intent)
            case 'signOut':
                return this.signOut(intent)
        }
    }

    private async signIn(intent: SignInIntent): Promise<void> {
        const [email, password] = this.validate(intent.email, intent.password)
        try {
            const response = await this.signInUseCase.invoke({email: email, password: password})
            this.state = {
                isAuthenticated: true,
                credentials: { user: response.user, token: response.token }
            }
        } catch (e: any) {
            this.state = { isAuthenticated: false }
            throw e;
        }
    }

    private async signUp(intent: SignUpIntent): Promise<void> {
        const [email, password] = this.validate(intent.email, intent.password)
        const request = <SignUpRequest> {
            email,
            password,
            firstName: intent.firstName?.trim(),
            lastName: intent.lastName?.trim(),
            phoneNumber: intent.phoneNumber?.trim()
        }
        try {
            const response = await this.signUpUseCase.invoke(request);
            this.state = {
                isAuthenticated: true,
                credentials: { user: response.user, token: response.token }
            }
        } catch (e: any) {
            this.state = { isAuthenticated: false }
            throw e;
        }
    }

    private async signOut(intent: SignOutIntent): Promise<void> {
        this.state = { isAuthenticated: false }
    }

    private validate(email: string, password: string): [email: string, password: string] {
        email = email.trim().toLowerCase();
        if (email.length === 0) throw new Error("Email is required");
        if (password.length === 0) throw new Error("Password is required");
        return [email, password];
    }
}
