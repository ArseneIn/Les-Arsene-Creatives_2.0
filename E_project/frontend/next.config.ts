import type { NextConfig } from "next";
import os from "os";

// Get local network interfaces to dynamically allow local IPs in development
const localIPs = Object.values(os.networkInterfaces())
  .flatMap((interfaces) => interfaces || [])
  .filter((ip) => ip.family === "IPv4" || ip.family === "IPv6")
  .map((ip) => ip.address);

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    ...localIPs,
    ...localIPs.map((ip) => `${ip}:3000`),
    ...localIPs.map((ip) => `${ip}:3001`),
    ...localIPs.map((ip) => `${ip}:3002`),
  ],
};

export default nextConfig;

