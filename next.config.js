const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.stockcake.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
