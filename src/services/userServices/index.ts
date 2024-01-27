import { Request, Response } from "express";
import { DocumentType } from "@typegoose/typegoose";
import expressAsyncHandler from "express-async-handler";
import { validateMongoDBId } from "../../utils/helper";
import { CartProduct, User } from "../../models/user";
import { ProductModel, UserModel } from "../../models";
import { Product } from "../../models/product";

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
const removeAnItemFromCart = expressAsyncHandler(async (request:Request, response: Response): Promise<void> => {
  const { productId, color } = request.body;
  const { _id } = request.user
  validateMongoDBId(_id)

  
  const user: DocumentType<User> | null = await UserModel.findById(_id);
  const remainingItem: CartProduct[] = user?.cart
    ? user.cart.filter(
        (item) => !(item._id!.toString() === productId && item.color === color)
      )
    : [];
  
  const cartTotal = remainingItem.reduce(
    (total, item) => total + item.totalPrice!,
    0
  );
    
  const updatedCart: DocumentType<User> | null =
    await UserModel.findByIdAndUpdate(_id, { cart: remainingItem, cartTotal }, { new: true });
  response.json(updatedCart)
})

//Empty User Cart
const emptyUserCart = expressAsyncHandler(async (request:Request, response: Response): Promise<void> => {
  const { _id } = request.user;
  validateMongoDBId(_id)

  const emptyCart: DocumentType<User> | null = await UserModel.findByIdAndUpdate(_id, { cart: [], cartTotal: 0, totalAfterDiscount: 0 }, { new: true })

  response.json(emptyCart)
})

export { addToUserCart, removeAnItemFromCart, emptyUserCart };
