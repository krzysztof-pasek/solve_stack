import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ["pino", "pino-pretty"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "static.vecteezy.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
        ],
    },
    transpilePackages: ["next-mdx-remote"],
};

export default nextConfig;
