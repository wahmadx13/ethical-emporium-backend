import { Request, Response } from "express";
import { DocumentType } from "@typegoose/typegoose";
import expressAsyncHandler from "express-async-handler";
import { validateMongoDBId } from "../../utils/helper";
import { Color } from "../../models/color";
import { ColorModel } from "../../models";

//Create A Color
const createColor = async (request: Request, response: Response) => {
  try {
    const findColor: DocumentType<Color> | null = await ColorModel.findOne(
      request.body
    );
    if (findColor) {
      response.json({
        statusCode: 304,
        message: `Color: "${request.body.title}" already exists!. Please try adding a different name`,
      });
      return;
    } else {
      const createColor: DocumentType<Color> = await ColorModel.create(
        request.body
      );

      response.json({
        statusCode: 200,
        message: `Color: "${request.body.title}" added successfully.`,
        createColor,
      });
    }
  } catch (err) {
    response.json({
      statusCode: 500,
      message: err,
    });
  }
};

//Update A Color
const updateColor = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { id } = request.params;
  validateMongoDBId(id);
  try {
    const findColor: DocumentType<Color> | null = await ColorModel.findById(id);
    if (findColor?.title === request.body?.title) {
      response.json({
        statusCode: 304,
        message: `Color: ${findColor?.title} already exists. Please try adding a new one`,
      });
      return;
    }
    const updateColor: DocumentType<Color> | null =
      await ColorModel.findByIdAndUpdate(id, request.body, {
        new: true,
      });
    response.json({
      statusCode: 200,
      message: "Color updated successfully!",
      updateColor,
    });
  } catch (err) {
    response.json({
      statusCode: 500,
      message: err,
    });
  }
};

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
const deleteAColor = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { id } = request.params;
    validateMongoDBId(id);
    const deleteColor: DocumentType<Color> | null =
      await ColorModel.findByIdAndDelete(id);
    response.json({
      statusCode: 200,
      deleteColor,
      message: `Color deletion successful`,
    });
  } catch (err) {
    response.json({
      statusCode: 500,
      message: err,
    });
  }
};

export { createColor, updateColor, getAColor, getAllColors, deleteAColor };
