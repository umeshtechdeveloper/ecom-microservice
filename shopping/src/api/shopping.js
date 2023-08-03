const ShoppingService = require("../services/shopping-service");
const { SubscribeMessage } = require("../utils");
const UserAuth = require("./middlewares/auth");

module.exports = (app, channel) => {
  const service = new ShoppingService();

  SubscribeMessage(channel, service);

  // Cart

  app.post("/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { product_id, qty } = req.body;
    try {
        const { data } = await service.AddCartItem(_id, product_id, qty);
        res.status(200).json(data);
    } catch (error) {
      next(error);
    }

  });

  app.delete("/cart/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;
    try {
        const { data } = await service.RemoveCartItem(_id, productId);
        res.status(200).json(data);
    } catch (error) {
      next(error);
    }
   
  });

  app.get("/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    try {
        const data = await service.GetCart(_id);
        return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
    
  });

  // Wishlist

  app.post("/wishlist", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { product_id } = req.body;
    try {
        const data = await service.AddToWishlist(_id, product_id);
        return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
   
  });

  app.get("/wishlist", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    try {
        const data = await service.GetWishlist(_id);
        return res.status(200).json(data);
    } catch (error) {
      next(error);
    }

  });

  app.delete("/wishlist/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const product_id = req.params.id;
    try {
        const data = await service.RemoveFromWishlist(_id, product_id);
        return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
    
  });

  // Orders

  app.post("/order", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    try {
        const data = await service.CreateOrder(_id);
        return res.status(200).json(data);
    } catch (error) {
      next (error);
    }

  });

  app.get("/order/:id", UserAuth, async (req, res, next) => {
    const orderId = req.params.id;
    try {
      const data = await service.GetOrder(orderId);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }

  });

  app.get("/orders", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    try {
        const data = await service.GetOrders(_id);
        return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.get("/whoami", (req, res, next) => {
    return res.status(200).json({ msg: "/shoping : I am Shopping Service" });
  });
};
