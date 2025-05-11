import app from "./app";
import config from "./config/config";
import logger from "./utils/logger";
import connectDB from "./config/database";
import redisClient from "./config/redis";

class Server {
  private port: number;

  constructor(port: number) {
    this.port = port;
  }

  public async start() {
    try {
      await connectDB();
      await redisClient.connect();
      logger.info("Redis connected");
      app.listen(this.port, () => {
        logger.info(`Server is running at port ${this.port}`);
      });
    } catch (error) {
      logger.error("Failed to start server:", error);
      process.exit(1);
    }
  }
}

const server = new Server(Number(config.port));
server.start();
