/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: "https",
              hostname: "hqypbucqgqxvhtyuefpp.supabase.co",
            },
          ],
      },
};

export default nextConfig;
