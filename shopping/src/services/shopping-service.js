const { ShoppingRepository } = require("../database");
const { FormatData, RPCRequest } = require("../utils");
const { RPC_QUEUE_NAME } = require("../config");
const { NotFoundError, APIError } = require("../utils/errors/app-errors");

// All Business logic will be here

class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }

  // Cart Info

  async AddCartItem(customerId, product_id, qty) {
    // Grab product info from product Service through RPC
    try {
      const productResponse = await RPCRequest(RPC_QUEUE_NAME, {
        type: "VIEW_PRODUCT",
        data: product_id,
      });
      if (productResponse && productResponse._id) {
        const data = await this.repository.ManageCart(
          customerId,
          productResponse,
          qty
        );
        return data;
      }
    } catch {
      throw new APIError("Internal server error, try after sometime!");
    }
  }

  async RemoveCartItem(customerId, product_id) {
    try {
      return await this.repository.ManageCart(
        customerId,
        { _id: product_id },
        0,
        true
      );
    } catch {
      throw new APIError("Action not completed, try after sometime!");
    }
  }

  async GetCart(_id) {
    try {
      return this.repository.Cart(_id);
    } catch {
      throw new NotFoundError("Cart not found!");
    }
  }

  async ManageCart(customerId, item, qty, isRemove) {
    try {
      const cartResult = await this.repository.AddCartItem(
        customerId,
        item,
        qty,
        isRemove
      );
      return FormatData(cartResult);
    } catch {
      throw new APIError("Action failed, try after sometime");
    }
  }

  // Wishlist

  async AddToWishlist(customerId, product_id) {
    try {
      return this.repository.ManageWishlist(customerId, product_id);
    } catch {
      throw new APIError("Action not completed, try after sometime!");
    }
  }

  async RemoveFromWishlist(customerId, product_id) {
    try {
      return this.repository.ManageWishlist(customerId, product_id, true);
    } catch {
      throw new APIError("Action not completed, try after sometime!");
    }
  }

  async GetWishlist(customerId) {
    try {
      const wishlist = await this.repository.GetWishlistByCustomerId(
        customerId
      );
      if (!wishlist) {
        return {};
      }
      const { products } = wishlist;

      if (Array.isArray(products)) {
        const ids = products.map(({ _id }) => _id);

        // Perform RPC call

        const productResponse = await RPCRequest("PRODUCT_RPC", {
          type: "VIEW_PRODUCTS",
          data: ids,
        });
        if (productResponse) {
          return productResponse;
        }
      }

      return {};
    } catch {
      throw new APIError("Action not completed, try after sometime!");
    }
  }

  // Orders

  async CreateOrder(customerId) {
    try {
      return this.repository.CreateNewOrder(customerId);
    } catch {
      throw new APIError("Placing order failed!");
    }
  }

  async GetOrder(orderId) {
    try {
      return this.repository.Orders("", orderId);
    } catch {
      throw new NotFoundError("Order details not found!");
    }
  }

  async GetOrders(customerId) {
    try {
      return this.repository.Orders(customerId);
    } catch {
      throw new NotFoundError("Orders list not found!");
    }
  }

  async deleteProfileData(customerId) {
    try {
      return this.repository.deleteProfileData(customerId);
    } catch {
      throw new APIError("Action not completed, try after sometime!");
    }
  }

  async SubscribeEvents(payload) {
    payload = JSON.parse(payload);
    const { event, data } = payload;
    switch (event) {
      case "DELETE_PROFILE":
        await this.deleteProfileData(data.userId);
        break;
      default:
        break;
    }
  }
}

module.exports = ShoppingService;
