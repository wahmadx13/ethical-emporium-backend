import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { DocumentType, Ref } from "@typegoose/typegoose";
import expressAsyncHandler from "express-async-handler";
import { deleteUser } from "aws-amplify/auth";
import { validateMongoDBId } from "../../utils/helper";
import { CartProduct, User } from "../../models/user";
import { OrderModel, ProductModel, UserModel } from "../../models";
import { Product } from "../../models/product";
import { Order } from "../../models/order";

//Update User
const updateUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { _id } = request.user;
    validateMongoDBId(_id as string);
    console.log("_id", _id);

    const updateUser: DocumentType<User> | null =
      await UserModel.findByIdAndUpdate(
        _id,
        {
          name: request?.body?.name,
          address: request?.body?.address,
        },
        { new: true }
      );

    if (updateUser) {
      response.json(updateUser);
    } else {
      response.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
  }
);

//Get All Users
const getAllUsers = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const getAllUsers: DocumentType<User>[] = await UserModel.find();
    response.json({ status: 200, getAllUsers });
  }
);

//Get A User
const getAUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    const getAUser: DocumentType<User> | null = await UserModel.findById(id);
    response.json({ status: 200, getAUser });
  }
);

//Add To Cart
const addToUserCart = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { productId, count, color } = request.body;
    const { _id } = request.user;
    validateMongoDBId(_id);
    validateMongoDBId(productId);

    const user: DocumentType<User> | null = await UserModel.findById(_id);

    const findProduct: DocumentType<Product> | null =
      await ProductModel.findById(productId);

    if (!user) {
      response.status(404).json({ message: "User not found" });
      return;
    }

    if (!findProduct) {
      response.status(404).json({ message: "Product not found" });
      return;
    }

    let cartProduct: CartProduct[] = [...user.cart!];

    const existingCartItemIndex = cartProduct.findIndex(
      (item) => item._id?.toString() === productId && item.color === color
    );

    if (existingCartItemIndex !== -1) {
      // If the same product with the same color is already in the cart, update its count and total price
      cartProduct[existingCartItemIndex].count += count;
      cartProduct[existingCartItemIndex].totalPrice! +=
        findProduct.price * count;
    } else {
      // If the product with the same color is not in the cart, add it as a new item
      cartProduct.push({
        _id: findProduct._id,
        count,
        color,
        singleItemPrice: findProduct.price,
        totalPrice: findProduct.price * count,
      });
    }

    // Calculate cart total
    const cartTotal = cartProduct.reduce(
      (total, item) => total + item.totalPrice!,
      0
    );

    // Update user's cart and cartTotal
    const updatedUser = await UserModel.findByIdAndUpdate(
      _id,
      { cart: cartProduct, cartTotal },
      { new: true }
    );

    response.json(updatedUser);
  }
);

//Remove From Cart
const removeAnItemFromCart = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { productId, color } = request.body;
    const { _id } = request.user;
    validateMongoDBId(_id);

    const user: DocumentType<User> | null = await UserModel.findById(_id);
    const remainingItem: CartProduct[] = user?.cart
      ? user.cart.filter(
          (item) =>
            !(item._id!.toString() === productId && item.color === color)
        )
      : [];

    const cartTotal = remainingItem.reduce(
      (total, item) => total + item.totalPrice!,
      0
    );

    const updatedCart: DocumentType<User> | null =
      await UserModel.findByIdAndUpdate(
        _id,
        { cart: remainingItem, cartTotal },
        { new: true }
      );
    response.json(updatedCart);
  }
);

//Empty User Cart
const emptyUserCart = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { _id } = request.user;
    validateMongoDBId(_id);

    const emptyCart: DocumentType<User> | null =
      await UserModel.findByIdAndUpdate(
        _id,
        { cart: [], cartTotal: 0, totalAfterDiscount: 0 },
        { new: true }
      );

    response.json(emptyCart);
  }
);

// Create Order
const createOrder = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { paymentOption } = request.body;
    const { _id } = request.user;
    validateMongoDBId(_id);

    if (paymentOption !== "card" || paymentOption === "cod") {
      response.json({
        message: "Order cannot be processed. Please select payment options",
      });
    }

    const user: DocumentType<User> | null = await UserModel.findById(_id);

    let userCart = user?.cart;

    console.log("userCart", userCart);

    const newOrder: DocumentType<Order> | null = await new OrderModel({
      orderedProducts: userCart?.map((item) => ({
        _id: item._id,
        count: item.count,
        color: item.color,
      })),
      paymentIntent: {
        id: uuid(),
        method: paymentOption,
        amount: user?.cartTotal,
        status: "Processing",
        created: Date.now(),
        currency: "usd",
      },
      paymentOption,
      orderBy: user?._id,
      orderStatus: "Processing",
    }).save();

    let updateCart: {
      updateOne: {
        filter: { _id: Ref<Product> | undefined };
        update: { $inc: { quantity: number; sold: number } };
      };
    }[] = [];

    if (userCart) {
      updateCart = userCart.map((item) => ({
        updateOne: {
          filter: { _id: item._id },
          update: { $inc: { quantity: -item.count!, sold: +item.count! } },
        },
      }));
    }

    //Empty User Cart
    await UserModel.findByIdAndUpdate(
      _id,
      {
        cart: [],
        cartTotal: 0,
        totalAfterDiscount: 0,
      },
      { new: true }
    );

    // Update Product Quantity
    await ProductModel.bulkWrite(updateCart, {});

    response.json({
      message: "Order processed successfully",
      newOrder,
    });
  }
);

//Get All Orders By A User
const getAllOrdersByAUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);

    const userOrders: DocumentType<Order> | null = await OrderModel.findOne({
      orderBy: id,
    })
      .populate("orderedProducts._id")
      .populate("orderBy")
      .exec();

    response.json(userOrders);
  }
);

//Get All Orders For A User
const getAllOrdersForUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.user;
    validateMongoDBId(id);

    const userOrdersForUser: DocumentType<Order> | null =
      await OrderModel.findOne({
        orderBy: id,
      })
        .populate("orderedProducts._id")
        .populate("orderBy")
        .exec();

    response.json(userOrdersForUser);
  }
);

//Get All Orders
const getAllOrders = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const allOrders: DocumentType<Order>[] = await OrderModel.find()
      .populate("orderedProducts._id")
      .populate("orderBy")
      .exec();

    response.json(allOrders);
  }
);

//Update Order Status
const updateOrderStatus = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { status } = request.body;
    const { id } = request.params;
    validateMongoDBId(id);

    const updateStatus: DocumentType<Order> | null =
      await OrderModel.findByIdAndUpdate(
        id,
        { orderStatus: status, paymentIntent: { status: status } },
        { new: true }
      );
    response.json(updateStatus);
  }
);

//Delete Order
const deleteOrder = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    const deleteOrder: DocumentType<Order> | null =
      await OrderModel.findByIdAndDelete(id);

    response.json(deleteOrder);
  }
);

//Delete A User
const deleteAUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const deleteAUser = await UserModel.findByIdAndDelete(id);
    await deleteUser();
    response.json({ status: 200, deleteAUser });
  }
);

//Block User
const blockAUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const blockUser: DocumentType<User> | null =
      await UserModel.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
    response.json({ message: "User Blocked", blockUser });
  }
);

//Unblock A User
const unblockAUser = expressAsyncHandler(
  async (request: Request, response: Response): Promise<void> => {
    const { id } = request.params;
    validateMongoDBId(id);
    const unblockUser: DocumentType<User> | null =
      await UserModel.findByIdAndUpdate(
        id,
        { isBlocked: false },
        { new: true }
      );
    response.json({ status: 200, message: "User unblocked", unblockUser });
  }
);

export {
  updateUser,
  getAllUsers,
  getAUser,
  addToUserCart,
  removeAnItemFromCart,
  emptyUserCart,
  createOrder,
  getAllOrdersByAUser,
  getAllOrdersForUser,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  deleteAUser,
  blockAUser,
  unblockAUser,
};
