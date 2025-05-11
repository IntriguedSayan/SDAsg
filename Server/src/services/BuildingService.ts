import Building, { IBuilding, IFacade } from "../models/Building";
import logger from "../utils/logger";
import { getElectricityRate, getSolarRadiation } from "../utils/constants";
import redisClient from "../config/redis";
import crypto from "crypto";

interface serviceResponse {
  status: number;
  message: string;
}

export class BuildingService {
  private validateFacade(facade: IFacade): void {
    if (
      !facade.orientation ||
      !["north", "south", "east", "west"].includes(facade.orientation)
    ) {
      throw new Error(
        "Invalid facade orientation. Must be north, south, east, or west."
      );
    }
    if (facade.height <= 0) {
      throw new Error("Facade height must be greater than 0.");
    }
    if (facade.width <= 0) {
      throw new Error("Facade width must be greater than 0.");
    }
    if (facade.wwr < 0 || facade.wwr > 1) {
      throw new Error("Window-to-wall ratio (wwr) must be between 0 and 1.");
    }
  }

  private validateBuildingData(buildingData: Partial<IBuilding>): void {
    if (!buildingData.name?.trim()) {
      throw new Error("Building name is required.");
    }
    if (!buildingData.city?.trim()) {
      throw new Error("City is required.");
    }
    if (
      buildingData.shgc === undefined ||
      buildingData.shgc < 0 ||
      buildingData.shgc > 1
    ) {
      throw new Error(
        "Solar Heat Gain Coefficient (SHGC) must be between 0 and 1."
      );
    }
    if (buildingData.cop !== undefined && buildingData.cop <= 0) {
      throw new Error(
        "Coefficient of Performance (COP) must be greater than 0."
      );
    }
    if (!buildingData.facades?.length) {
      throw new Error("At least one facade is required.");
    }
    buildingData.facades.forEach(this.validateFacade);
  }

  public async create(
    buildingData: Partial<IBuilding>
  ): Promise<serviceResponse> {
    try {
      this.validateBuildingData(buildingData);

      const building = new Building(buildingData);
      const savedBuilding = await building.save();

      logger.info(`Building created successfully: ${savedBuilding.name}`);
      return { status: 201, message: "Building created successfully" };
    } catch (error) {
      logger.error("Error creating building:", error);
      throw error;
    }
  }

  public async getAll(): Promise<{ status: number; buildings: IBuilding[] }> {
    const buildings = await Building.find().sort({ createdAt: -1 });
    return {
      status: 200,
      buildings,
    };
  }

  public async getById(
    id: string
  ): Promise<{ status: number; building: IBuilding }> {
    try {
      const building = await Building.findById(id);
      if (!building) {
        throw new Error("Building not found");
      }
      return { status: 200, building };
    } catch (error) {
      logger.error("Error fetching building:", error);
      throw error;
    }
  }

  public async update(
    id: string,
    buildingData: Partial<IBuilding>
  ): Promise<{ status: number; building: IBuilding }> {
    try {
      this.validateBuildingData(buildingData);

      const building = await Building.findByIdAndUpdate(
        id,
        { $set: buildingData },
        { new: true, runValidators: true }
      );

      if (!building) {
        throw new Error("Building not found");
      }

      logger.info(`Building updated successfully: ${building.name}`);
      return { status: 200, building };
    } catch (error) {
      logger.error("Error updating building:", error);
      throw error;
    }
  }

  public async delete(id: string): Promise<serviceResponse> {
    try {
      const building = await Building.findByIdAndDelete(id);
      if (!building) {
        throw new Error("Building not found");
      }
      logger.info(`Building deleted successfully: ${building.name}`);
      return {
        status: 200,
        message: `builiding with ${id} deleted successfully`,
      };
    } catch (error) {
      logger.error("Error deleting building:", error);
      throw error;
    }
  }

  public async analyzeBuilding(buildingData: Partial<IBuilding>) {
    const cacheKey =
      "analyze:" +
      crypto
        .createHash("md5")
        .update(JSON.stringify(buildingData))
        .digest("hex");
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const {
      facades = [],
      shgc = 0,
      cop = 4,
      city = "",
      skylight,
    } = buildingData;

    const solarData = getSolarRadiation(city);
    const rate = getElectricityRate(city);
    const deltaT = 5;

    let totalHeatGain = 0;

    facades.forEach((f) => {
      const area = f.height * f.width * f.wwr;
      totalHeatGain += area * shgc * solarData[f.orientation] * deltaT;
    });

    if (skylight?.height && skylight?.width) {
      const skylightArea = skylight.height * skylight.width;
      totalHeatGain += skylightArea * shgc * solarData["roof"] * deltaT;
    }

    const coolingLoad = totalHeatGain / 3412;
    const energyConsumed = coolingLoad / cop;
    const cost = energyConsumed * rate;

    const res = {
      status: 200,
      analyzedData: {
        totalHeatGain,
        coolingLoad: parseFloat(coolingLoad.toFixed(3)),
        energyConsumed: parseFloat(energyConsumed.toFixed(3)),
        cost: parseFloat(cost.toFixed(2)),
      },
    };

    await redisClient.set(cacheKey, JSON.stringify(res), { EX: 3600 });

    return res;

  }
}
