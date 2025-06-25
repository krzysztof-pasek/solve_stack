import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ["pino", "pino-pretty"],
    images: {
        domains: ["static.vecteezy.com"], // add every external host you need
    },
};

export default nextConfig;
