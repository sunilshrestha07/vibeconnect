/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google user images
      'firebasestorage.googleapis.com', // Firebase Storage images
    ],
  },

};

export default nextConfig;
