/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
    eslint: {
        // Bypass ESLint during production builds (e.g., on Vercel)
        ignoreDuringBuilds: true,
    },
    outputFileTracingRoot: __dirname,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
                pathname: '**',
            },
        ],
    },
    turbopack: {
        resolveAlias: {
            '@': '.',
        },
    },
};

export default nextConfig;
