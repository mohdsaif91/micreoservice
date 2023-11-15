const { ProductModel, OrderModel, CartModel } = require("../models");
const { v4: uuidv4 } = require("uuid");
const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../../utils/app-errors");

//Dealing with data base operations
class ShoppingRepository {
  // payment

  async Orders(customerId) {
    try {
      const orders = await OrderModel.find({ customerId });
      return orders;
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Orders"
      );
    }
  }

  async Cart(customerId) {
    try {
      const cartItems = await CartModel.find({ customerId });
      if (cartItems) {
        return cartItems;
      }
      throw new Error("Data not Found !");
    } catch (error) {
      throw error;
    }
  }

  async AddCartItem(customerId, item, qty, isRemove) {
    try {
      const cart = await CartModel.findOne({ customerId });
      const { id } = item;
      if (cart) {
        let isExist = false;
        let cartItem = cart.items;
        if (cartItem.length > 0) {
          cartItem.map((item) => {
            if (itemproduct._id.toString() === product._id.toString()) {
              if (isRemove) {
                cartItem.splice(cartItem.indexOf(item), 1);
              } else {
                item.unit = qty;
              }
              isExist = true;
            }
          });
          if (!isExist && !isRemove) {
            cartItem.push({ product: { ...item }, unit: qty });
          }
          cart.items = cartItem;
          return cart.save();
        } else {
          return await CartModel.create({
            customerId,
            items: [{ product: { ...item }, unit: qty }],
          });
        }
      }
    } catch (error) {
      throw new APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to create Customer"
      );
    }
  }

  async CreateNewOrder(customerId, txnId) {
    //check transaction for payment Status

    try {
      const cart = await CartModel.findOne(customerId);

      if (cart) {
        let amount = 0;
        let cartItems = cart.items;

        if (cartItems.length > 0) {
          //process Order
          cartItems.map((item) => {
            amount += parseInt(item.product.price) * parseInt(item.unit);
          });

          const orderId = uuidv4();

          const order = new OrderModel({
            orderId,
            customerId,
            amount,
            txnId,
            status: "received",
            items: cartItems,
          });

          cart.items = [];

          const orderResult = await order.save();

          await cart.save();

          return orderResult;
        }
      }

      return {};
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find Category"
      );
    }
  }
}

module.exports = ShoppingRepository;
