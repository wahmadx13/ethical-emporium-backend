import { Request, Response } from "express";
import { DocumentType } from "@typegoose/typegoose";
import expressAsyncHandler from "express-async-handler";
import { validateMongoDBId } from "../../utils/helper";
import { Color } from "../../models/color";
import { ColorModel } from "../../models";

//Create A Color
const createColor = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const createColor: DocumentType<Color> = await ColorModel.create(
      request.body
    );

    response.json(createColor);
  }
);

//Update A Color
const updateColor = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const updateColor: DocumentType<Color> | null =
      await ColorModel.findByIdAndUpdate(id, request.body, {
        new: true,
      });
    response.json(updateColor);
  }
);

//Get A Color
const getAColor = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const getColor: DocumentType<Color> | null = await ColorModel.findById(id);
    response.json(getColor);
  }
);

//Get All Colors
const getAllColors = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const getColors: DocumentType<Color>[] = await ColorModel.find();
    response.json(getColors);
  }
);

//Delete A Color
const deleteAColor = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const deleteColor: DocumentType<Color> | null =
      await ColorModel.findByIdAndDelete(id);
    response.json(deleteColor);
  }
);

export { createColor, updateColor, getAColor, getAllColors, deleteAColor };
