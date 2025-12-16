/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Bypass ESLint during production builds (e.g., on Vercel)
        ignoreDuringBuilds: true,
    },
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
    api: {
        bodyParser: {
            sizeLimit: '50mb', // Increase payload size limit
        },
    },
};

export default nextConfig;
