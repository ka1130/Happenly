const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.stockcake.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fwerekvhzbejncpoptba.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
