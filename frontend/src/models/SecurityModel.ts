import {Credentials} from "cinetex-core/dist/security/Credentials";
import {SignIn, SignInResponse, SignUp, SignUpRequest, SignUpResponse} from "cinetex-core/dist/application/requests";

export class SecurityModel {

    private _credentials: Credentials | undefined

    private changeListeners: ((credentials: Credentials | undefined) => void)[] = []

    constructor(readonly signInUseCase: SignIn, readonly signUpUseCase: SignUp) {
    }

    get credentials(): Credentials | undefined {
        return this._credentials
    }

    get isAuthenticated(): boolean {
        return !!this._credentials
    }

    get isAnonymous(): boolean {
        return !this._credentials
    }

    hasAnyRole(...roles: string[]): boolean {
        return this._credentials?.user.roles.some(role => roles.includes(role)) ?? false
    }

    subscribe(listener: (credentials: Credentials | undefined) => void): { readonly unsubscribe: () => void} {
        this.changeListeners.push(listener)
        return {
            unsubscribe: () => {
                this.changeListeners = this.changeListeners.filter(l => l !== listener)
            }
        }
    }

    private notifyCredentialsChanged() {
        this.changeListeners.forEach(listener => listener(this._credentials))
    }

    private handleResponse(response: SignInResponse | SignUpResponse): Credentials {
        this._credentials = {
            user: response.user,
            token: response.token
        }
        this.notifyCredentialsChanged()
        return this._credentials
    }

    private handleException(e: any): never {
        if (this._credentials !== undefined) {
            this._credentials = undefined
            this.notifyCredentialsChanged()
        }
        throw e;
    }

    async signIn(userName: string, password: string): Promise<Credentials> {
        userName = userName.trim().toLowerCase()
        try {
            return this.handleResponse(await this.signInUseCase.invoke({email: userName, password: password}))
        } catch (e: any) {
            this.handleException(e)
        }
    }

    async signUp(info: SignUpRequest): Promise<Credentials> {
        const username = info.email.trim().toLowerCase()
        try {
            return this.handleResponse(await this.signUpUseCase.invoke({...info, email: username}))
        } catch (e: any) {
            this.handleException(e)
        }
    }

    async signOut(): Promise<void> {
        this._credentials = undefined
        this.notifyCredentialsChanged()
    }
}
