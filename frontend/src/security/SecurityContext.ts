import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";
import {SignIn, SignInResponse, SignUp, SignUpRequest, SignUpResponse} from "cinetex-core/dist/application/requests";

export class SecurityContext {

    private _credentials: SecurityCredentials | undefined

    private changeListeners: ((credentials: SecurityCredentials | undefined) => void)[] = []

    constructor(readonly signInUseCase: SignIn, readonly signUpUseCase: SignUp) {
    }

    get credentials(): SecurityCredentials | undefined {
        return this._credentials
    }

    get isAuthenticated(): boolean {
        return !!this._credentials
    }

    get isAnonymous(): boolean {
        return !this._credentials
    }

    subscribe(listener: (credentials: SecurityCredentials | undefined) => void): { readonly unsubscribe: () => void} {
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

    private handleResponse(response: SignInResponse | SignUpResponse): SecurityCredentials {
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

    async signIn(userName: string, password: string): Promise<SecurityCredentials> {
        userName = userName.trim().toLowerCase()
        try {
            return this.handleResponse(await this.signInUseCase.invoke({email: userName, password: password}))
        } catch (e: any) {
            this.handleException(e)
        }
    }

    async signUp(info: SignUpRequest): Promise<SecurityCredentials> {
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
