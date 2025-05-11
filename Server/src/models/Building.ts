import mongoose, { Schema } from "mongoose";

export interface IFacade {
  orientation: "north" | "south" | "east" | "west";
  height: number;
  width: number;
  wwr: number;
}

export interface ISkyLight {
  height: number;
  width: number;
}

export interface IBuilding extends Document {
  name: string;
  city: string;
  shgc: number;
  cop: number;
  facades: IFacade[];
  skylight?: ISkyLight;
  createdAt: Date;
}

const FacadeSchema: Schema = new Schema(
  {
    orientation: { type: String, required: true },
    height: { type: Number, required: true },
    width: { type: Number, required: true },
    wwr: { type: Number, required: true },
  },
  {
    _id: false,
    versionKey: false,
    timestamps: true,
  }
);

const SkylightSchema: Schema = new Schema(
  {
    height: Number,
    width: Number,
  },
  { _id: false, versionKey: false, timestamps: true }
);

const BuildingSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    shgc: { type: Number, required: true },
    cop: { type: Number, default: 4 },
    facades: [FacadeSchema],
    skylight: SkylightSchema,
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model<IBuilding>("Building", BuildingSchema);
