const { ProductRepository } = require("../database");
const { FormatData } = require("../utils");
const { APIError, NotFoundError } = require("../utils/errors/app-errors");

// All Business logic will be here

class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async CreateProduct(productInputs) {
    const productResult = await this.repository.CreateProduct(productInputs);
    if (!productResult) {
      throw new APIError("try after sometime!");
    }
    return FormatData(productResult);
  }

  async GetProducts() {
    const products = await this.repository.Products();

    if (!products) {
      throw new NotFoundError("products not found, try after sometime!");
    }

    let categories = {};

    products.map(({ type }) => {
      categories[type] = type;
    });

    return FormatData({
      products,
      categories: Object.keys(categories),
    });
  }

  async GetProductDescription(productId) {
    const product = await this.repository.FindById(productId);
    if (!product) {
      throw new NotFoundError("product not found with provided product id!");
    }
    return FormatData(product);
  }

  async GetProductsByCategory(category) {
    const products = await this.repository.FindByCategory(category);
    if (!products) {
      throw new NotFoundError("products not found with provided category!");
    }
    return FormatData(products);
  }

  async GetSelectedProducts(selectedIds) {
    const products = await this.repository.FindSelectedProducts(selectedIds);
    if (!products) {
      throw new NotFoundError("products not found with provided product ids!");
    }
    return FormatData(products);
  }

  // RPC Response

  async serveRPCRequest(payload) {
    const { type, data } = payload;
    switch (type) {
      case "VIEW_PRODUCT":
        return this.repository.FindById(data);
        break;
      case "VIEW_PRODUCTS":
        return this.repository.FindSelectedProducts(data);
      default:
        break;
    }
  }
}

module.exports = ProductService;
