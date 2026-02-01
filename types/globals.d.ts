export {};

export type Roles = "admin" | "pro" | "free";

// Global TS type for custom session claims
declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            role?: Roles;
        };
    }
}
