/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      's.gravatar.com',
      'cdn.auth0.com',
      'https://ppc-in-dev.us.auth0.com', // Replace with your actual Auth0 domain
      'lh3.googleusercontent.com', // For Google OAuth avatars
      'platform-lookaside.fbsbx.com', // For Facebook OAuth avatars
      'avatars.githubusercontent.com', // For GitHub OAuth avatars
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.auth0.com',
      },
      {
        protocol: 'https',
        hostname: '**.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },
}

module.exports = nextConfig