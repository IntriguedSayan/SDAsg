import { Request, Response } from "express";
import { BuildingService } from "../services/BuildingService";
import logger from "../utils/logger";

export class BuildingController {
  private service: BuildingService;

  constructor() {
    this.service = new BuildingService();
  }

  public createBuilding = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      if (!req.body) {
        return res.status(400).json({ message: "Request body is required" });
      }
      const serviceResponse = await this.service.create(req.body);
      return res
        .status(serviceResponse.status)
        .json({ message: serviceResponse.message });
    } catch (err: any) {
      logger.error("Error in createBuilding:", err);
      return res.status(err.status || 500).json({ message: err.message });
    }
  };

  public getAllBuildings = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const buildings = await this.service.getAll();
      return res
        .status(buildings.status)
        .json({ buildings: buildings.buildings });
    } catch (err: any) {
      return res.status(err.status || 500).json({ message: err.message });
    }
  };

  public analyzeBuilding = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const serviceRes = await this.service.analyzeBuilding(req.body);
      return res
        .status(serviceRes.status)
        .json({ analyzedData: serviceRes.analyzedData });
    } catch (err: any) {
      return res.status(err.status || 500).json({ message: err.message });
    }
  };
}
