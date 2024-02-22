import { Request, Response } from "express";
import { DocumentType } from "@typegoose/typegoose";
import expressAsyncHandler from "express-async-handler";
import { validateMongoDBId } from "../../utils/helper";
import { Brand } from "../../models/brand";
import { BrandModel } from "../../models";

//Create A Brand
const createBrand = async (request: Request, response: Response) => {
  console.log("hitting");
  try {
    const findBrand: DocumentType<Brand> | null = await BrandModel.findOne(
      request.body
    );
    if (findBrand) {
      response.json({
        statusCode: 304,
        message: `The brand: "${request.body}" already exists!. Please try with a different name.`,
      });
      return;
    } else {
      const createBrand: DocumentType<Brand> = await BrandModel.create(
        request.body
      );

      response.json({
        statusCode: 200,
        message: `Brand: "${request.body}" added successfully.`,
        createBrand,
      });
    }
  } catch (err) {
    response.json({
      statusCode: 500,
      message: err,
    });
  }
};

//Update A Brand
const updateBrand = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const updateBrand: DocumentType<Brand> | null =
      await BrandModel.findByIdAndUpdate(id, request.body, {
        new: true,
      });
    response.json(updateBrand);
  }
);

//Get A Brand
const getABrand = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const getBrand: DocumentType<Brand> | null = await BrandModel.findById(id);
    response.json(getBrand);
  }
);

//Get All Brands
const getAllBBrands = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const getBrands: DocumentType<Brand>[] = await BrandModel.find();
    response.json(getBrands);
  }
);

//Delete A Brand
const deleteABrand = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const deleteBrand: DocumentType<Brand> | null =
      await BrandModel.findByIdAndDelete(id);
    response.json(deleteBrand);
  }
);

export { createBrand, updateBrand, getABrand, getAllBBrands, deleteABrand };
