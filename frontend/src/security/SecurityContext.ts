import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";
import {SignIn} from "cinetex-core/dist/application/requests";
import {UseCaseInvokerFactory} from "cinetex-core/dist/application";

export class SecurityContext {

    private _credentials: SecurityCredentials | undefined

    constructor(readonly invokerFactory: UseCaseInvokerFactory) {
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

    async signIn(userName: string, password: string): Promise<SecurityCredentials> {
        try {
            const signInResponse = await new SignIn(this.invokerFactory).invoke({email: userName, password: password})
            this._credentials = {
                user: signInResponse.user,
                token: signInResponse.token
            }
            return this._credentials
        } catch (e) {
            this._credentials = undefined
            throw e
        }
    }

    async signOut(): Promise<void> {
        this._credentials = undefined
    }
}
