const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.stockcake.com",
        pathname: "/**", // dopuszcza wszystkie ścieżki
      },
    ],
  },
};
