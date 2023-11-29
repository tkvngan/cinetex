import bcrypt from "bcrypt";


const DEFAULT_SALT_ROUNDS = 10;
const ALGO = { name: "HMAC", hash: "SHA-256" } as HmacKeyGenParams;

let _secretKey: CryptoKey | undefined;

export async function secretKey(): Promise<CryptoKey> {
    if (!_secretKey && process.env.SECRET_KEY) {
        console.log("Using secret key from environment variable")
        _secretKey = await crypto.subtle.importKey("jwk", JSON.parse(process.env.SECRET_KEY), ALGO, true, ["sign", "verify"])
        console.log("Secret key:", JSON.stringify(await crypto.subtle.exportKey("jwk", _secretKey)))
    }
    if (!_secretKey) {
        console.log("Generating secret key")
        _secretKey = await crypto.subtle.generateKey(ALGO, true, ["sign", "verify"])
        console.log("Generated secret key:", JSON.stringify(await crypto.subtle.exportKey("jwk", _secretKey)))
    }
    return _secretKey;
}

export function secureHash(data: string, saltOrRounds?: string | number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        bcrypt.hash(data, saltOrRounds ?? DEFAULT_SALT_ROUNDS, function (err: any, hash: string) {
            err ? reject(err) : resolve(hash);
        })
    })
}

export function secureCompare(data: string, hash: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        bcrypt.compare(data, hash, function (err: any, result: boolean) {
            err ? reject(err) : resolve(result);
        })
    })
}
