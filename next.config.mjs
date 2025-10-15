/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        crypto: false,
        stream: false,
        path: false,
        os: false,
        'pg-native': false,
      }
    }
    
    config.externals = [...(config.externals || []), 'pg', 'pg-connection-string', 'pg-pool']
    
    return config
  },
  experimental: {
    serverComponentsExternalPackages: ['pg', 'pg-connection-string', 'pg-pool'],
  },
}

export default nextConfig
