import { Request, Response } from "express";
import { DocumentType } from "@typegoose/typegoose";
import expressAsyncHandler from "express-async-handler";
import { Enquiry } from "../../models/enquiry";
import { EnquiryModel } from "../../models";
import { validateMongoDBId } from "../../utils/helper";

//Create An Enquiry
const createAnEnquiry = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const createEnquiry: DocumentType<Enquiry> = await EnquiryModel.create(
      request.body
    );
    response.json({
      statusCode: 200,
      message: "Enquiry created successfully!",
      createEnquiry,
    });
  } catch (err) {
    response.json({
      statusCode: 500,
      message: `The following error occurred during creating enquiry`,
    });
  }
};

//Update An Enquiry
const updateAnEnquiry = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { id } = request.params;
  validateMongoDBId(id);
  try {
    const updateEnquiry: DocumentType<Enquiry> | null =
      await EnquiryModel.findByIdAndUpdate(id, request.body, { new: true });
    response.json({
      statusCode: 200,
      message: `Enquiry status updated successfully`,
      updateEnquiry,
    });
  } catch (err) {
    response.json({
      statusCode: 500,
      message: `The following error occurred while updating the enquiry: ${err}`,
    });
  }
};

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
const deleteAnEnquiry = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { id } = request.params;
  validateMongoDBId(id);
  try {
    const deleteEnquiry: DocumentType<Enquiry> | null =
      await EnquiryModel.findByIdAndDelete(id);
    response.json({
      statusCode: 200,
      message: "Enquiry deleted successfully!",
      deleteEnquiry,
    });
  } catch (err) {
    response.json({
      statusCode: 500,
      message: `The following error occurred while deleting the enquiry: ${err}`,
    });
  }
};

export {
  createAnEnquiry,
  updateAnEnquiry,
  getAnEnquiry,
  getAllEnquiries,
  deleteAnEnquiry,
};
