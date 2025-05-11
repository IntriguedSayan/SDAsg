import dotenv from "dotenv";

dotenv.config();

export default{
    port: process.env.PORT || 8000,
    dbURL: process.env.DATABASE_URL!,
    redisUrl: process.env.REDIS_URL
}