import { Request, Response } from "express";
import { DocumentType } from "@typegoose/typegoose";
import expressAsyncHandler from "express-async-handler";
import { Enquiry } from "../../models/enquiry";
import { EnquiryModel } from "../../models";

//Create An Enquiry
const createAnEnquiry = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const createEnquiry: DocumentType<Enquiry> = await EnquiryModel.create(
      request.body
    );
    response.json(createEnquiry);
  }
);

//Update An Enquiry
const updateAnEnquiry = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    const updateEnquiry: DocumentType<Enquiry> | null =
      await EnquiryModel.findByIdAndUpdate(id, request.body, { new: true });
    response.json(updateEnquiry);
  }
);

//Get an Enquiry
const getAnEnquiry = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    const getEnquiry: DocumentType<Enquiry> | null =
      await EnquiryModel.findById(id);
    response.json(getEnquiry);
  }
);

//Get All Enquiries
const getAllEnquiries = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const getEnquiries: DocumentType<Enquiry>[] = await EnquiryModel.find();
    response.json(getEnquiries);
  }
);

//Delete An Enquiry
const deleteAnEnquiry = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    const deleteEnquiry: DocumentType<Enquiry> | null =
      await EnquiryModel.findByIdAndDelete(id);
    response.json(deleteEnquiry);
  }
);

export {
  createAnEnquiry,
  updateAnEnquiry,
  getAnEnquiry,
  getAllEnquiries,
  deleteAnEnquiry,
};
