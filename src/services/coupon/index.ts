import { Request, Response } from "express";
import { DocumentType } from "@typegoose/typegoose";
import expressAsyncHandler from "express-async-handler";
import { validateMongoDBId } from "../../utils/helper";
import { CouponModel } from "../../models";
import { Coupon } from "../../models/coupon";

//Create A Coupon
const createACoupon = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const createCoupon: DocumentType<Coupon> = await CouponModel.create(
      request.body
    );

    response.json(createCoupon);
  }
);

//Update A Coupon
const updateACoupon = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const updateCoupon: DocumentType<Coupon> | null =
      await CouponModel.findByIdAndUpdate(id, request.body, {
        new: true,
      });
    response.json(updateCoupon);
  }
);

//Get A Coupon
const getACoupon = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const getCoupon: DocumentType<Coupon> | null = await CouponModel.findById(
      id
    );
    response.json(getCoupon);
  }
);

//Get All Coupons
const getAllCoupons = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const getColors: DocumentType<Coupon>[] = await CouponModel.find();
    response.json(getColors);
  }
);

//Delete A Coupon
const deleteACoupon = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const deleteCoupon: DocumentType<Coupon> | null =
      await CouponModel.findByIdAndDelete(id);
    response.json(deleteCoupon);
  }
);

export {
  createACoupon,
  updateACoupon,
  getACoupon,
  getAllCoupons,
  deleteACoupon,
};
