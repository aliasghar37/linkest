import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    outputFileTracingIncludes: {
        "/**": ["./prisma/generated/prisma/**/*.node"],
    },
};

export default nextConfig;
