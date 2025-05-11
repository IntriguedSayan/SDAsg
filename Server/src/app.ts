import express, {
  Application,
  ErrorRequestHandler,
  Router,
  Request,
  Response,
} from "express";
import { errorHandler } from "./middlewares/error.middleware";
import buildingRoutes from "./routes/buildingRoutes";

class App {
  public app: Application;
  public router: Router;

  constructor() {
    this.app = express();
    this.router = Router();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
  }

  private initializeRoutes() {
    this.router.get("/", (req: Request, res: Response) => {
      res.status(200).json({ message: "Hello world" });
    });
    
    // Mount building routes
    this.app.use("/api/buildings", buildingRoutes);
  }

  private initializeErrorHandling() {
    this.app.use(errorHandler as ErrorRequestHandler);
  }
}

export default new App().app;
