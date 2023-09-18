/** @type {import('next').NextConfig} */
const nextConfig = { experimental: { serverActions: true, appDir: true }, images: { domains: ['cloud.appwrite.io'] } }
module.exports = nextConfig