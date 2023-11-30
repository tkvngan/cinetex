import bcrypt from "bcrypt";
import {jwtVerify, SignJWT} from "jose";
import {User} from "cinetex-core/dist/domain/entities";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";

const DEFAULT_SALT_ROUNDS = 10;
const ALGO = { name: "HMAC", hash: "SHA-256" } as HmacKeyGenParams;

let _secureKey: CryptoKey | undefined;

async function getSecretKey(): Promise<CryptoKey> {
    if (!_secureKey && process.env.SECRET_KEY) {
        console.log("Using secret key from environment variable")
        _secureKey = await crypto.subtle.importKey("jwk", JSON.parse(process.env.SECRET_KEY), ALGO, true, ["sign", "verify"])
        console.log("Secret key:", JSON.stringify(await crypto.subtle.exportKey("jwk", _secureKey)))
    }
    if (!_secureKey) {
        console.log("Generating secret key")
        _secureKey = await crypto.subtle.generateKey(ALGO, true, ["sign", "verify"])
        console.log("Generated secret key:", JSON.stringify(await crypto.subtle.exportKey("jwk", _secureKey)))
    }
    return _secureKey;
}

export function createSecureHash(data: string, saltOrRounds?: string | number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        bcrypt.hash(data, saltOrRounds ?? DEFAULT_SALT_ROUNDS, function (err: any, hash: string) {
            err ? reject(err) : resolve(hash);
        })
    })
}

export async function createSecureToken(user: User): Promise<string> {
    const key = await getSecretKey();
    return await new SignJWT({user: user})
        .setIssuer("cinetex")
        .setSubject(user.email)
        .setExpirationTime("30m")
        .setAudience("cinetex")
        .setIssuedAt(new Date())
        .setProtectedHeader({alg: "HS256", typ: "JWT"})
        .sign(key)
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash)
}

export async function verifySecureToken(token: string): Promise<SecurityCredentials> {
    const {payload} = await jwtVerify(token, await getSecretKey(), {issuer: 'cinetex', audience: 'cinetex'})
    return <SecurityCredentials> {
        user: payload.user,
        token: token,
        attributes: payload
    }
}
