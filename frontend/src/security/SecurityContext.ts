import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";
import {SignIn} from "cinetex-core/dist/application/requests";

export class SecurityContext {

    private _credentials: SecurityCredentials | undefined

    private changeListeners: ((credentials: SecurityCredentials | undefined) => void)[] = []

    constructor(readonly signInUseCase: SignIn) {
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

    set onCredentialsChanged(listener: (credentials: SecurityCredentials | undefined) => void) {
        this.changeListeners.push(listener)
    }

    private notifyCredentialsChanged() {
        this.changeListeners.forEach(listener => listener(this._credentials))
    }

    async signIn(userName: string, password: string): Promise<SecurityCredentials> {
        try {
            const response = await this.signInUseCase.invoke({email: userName, password: password})
            this._credentials = {
                user: response.user,
                token: response.token
            }
            return this._credentials
        } catch (e: any) {
            this._credentials = undefined
            throw e;
        } finally {
            this.notifyCredentialsChanged()
        }
    }

    async signOut(): Promise<void> {
        this._credentials = undefined
        this.notifyCredentialsChanged()
    }
}
