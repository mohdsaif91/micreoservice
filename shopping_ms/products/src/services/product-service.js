const { ProductRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-errors");

// All Business logic will be here
class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async CreateProduct(productInputs) {
    try {
      const productResult = await this.repository.CreateProduct(productInputs);
      return FormateData(productResult);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProducts() {
    try {
      const products = await this.repository.Products();

      let categories = {};

      products.map(({ type }) => {
        categories[type] = type;
      });

      return FormateData({
        products,
        categories: Object.keys(categories),
      });
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProductDescription(productId) {
    try {
      console.log(`-----------------
        1
        --------------------------`);
      const product = await this.repository.FindById(productId);
      return FormateData(product);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProductsByCategory(category) {
    try {
      const products = await this.repository.FindByCategory(category);
      return FormateData(products);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetSelectedProducts(selectedIds) {
    try {
      const products = await this.repository.FindSelectedProducts(selectedIds);
      return FormateData(products);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProductById(productId) {
    try {
      console.log(`-----------------
        2
        --------------------------`);
      return await this.repository.FindById(productId);
    } catch (err) {
      throw new APIError("Data Not found");
    }
  }

  async GetProductPayload(userId, { productId, qty }, event) {
    try {
      console.log(`-----------------
        3
        --------------------------`);
      console.log("getProductPayload 222");
      const Product = await this.repository.FindById(productId);
      console.log(Product);
      if (Product) {
        console.log("Prduct 1");
        const payload = {
          event,
          data: { userId, product: Product, qty },
        };
        return FormateData(payload);
      } else {
        return FormateData({ error: "No product availabel" });
      }
    } catch (error) {
      throw new APIError("Data not found");
    }
  }
}

module.exports = ProductService;
