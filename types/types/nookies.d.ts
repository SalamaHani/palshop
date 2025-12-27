declare module 'nookies' {
    interface CookieOptions {
        path?: string;
        maxAge?: number;
        domain?: string;
        secure?: boolean;
        httpOnly?: boolean;
        sameSite?: 'lax' | 'strict' | 'none';
    }

    export function setCookie(
        ctx: any,
        name: string,
        value: string,
        options?: CookieOptions
    ): void;

    export function destroyCookie(
        ctx: any,
        name: string,
        options?: CookieOptions
    ): void;

    export function parseCookies(ctx?: any): Record<string, string>;
}
