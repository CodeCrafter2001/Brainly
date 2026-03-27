import type mongoose from "mongoose";
export {};

declare global {
  namespace Express {
    export interface Request {
      userId?: mongoose.Types.ObjectId;  
    }
  }
}
