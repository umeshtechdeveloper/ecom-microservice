const ProductService = require("../services/product-service");
const { RPCObserver } = require("../utils");
const { RPC_QUEUE_NAME } = require("../config");

module.exports = (app) => {
  const service = new ProductService();

  RPCObserver(RPC_QUEUE_NAME, service);

  app.post("/create", async (req, res, next) => {
    const { name, desc, type, unit, price, available, suplier, banner } =
      req.body;

    try {
      const { data } = await service.CreateProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        suplier,
        banner,
      });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.get("/category/:type", async (req, res, next) => {
    const type = req.params.type;

    try {
      const { data } = await service.GetProductsByCategory(type);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.get("/:id", async (req, res, next) => {
    const productId = req.params.id;

    try {
      const { data } = await service.GetProductDescription(productId);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });

  app.post("/ids", async (req, res, next) => {
    const { ids } = req.body;
    try {
      const products = await service.GetSelectedProducts(ids);
      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  });

  app.get("/whoami", (req, res, next) => {
    return res.status(200).json({ msg: "/products : I am products Service" });
  });

  //get all  products and category //

  app.get("/", async (req, res, next) => {
    try {
      const { data } = await service.GetProducts();
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  });
};
