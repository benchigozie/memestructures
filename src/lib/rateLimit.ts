import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

export const limits = {
    login: { max: 6, windowSec: 60 },   
    signup: { max: 10, windowSec: 60 }, 
    lead: { max: 15, windowSec: 60 },   
    general: { max: 100, windowSec: 60 },
};

export async function checkRateLimit(ip: string, route: keyof typeof limits = "general") {

    const { max, windowSec } = limits[route];
    const key = `rate-limit:${route}:${ip}`; 

    const current = await redis.incr(key);

    if (current === 1) {
        await redis.expire(key, windowSec);
    }

    if (current > max) {
        return false;
    }

    return true;
}