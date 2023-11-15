const ShoppingService = require("../services/shopping-service");

module.exports = (app) => {
  const service = new ShoppingService();
  app.use("/app-events", (req, res, next) => {
    const { payload } = req.body;
    service.SuscribeEvents(payload);
    console.log(
      "================= Shopping Service Recevied Event============"
    );
    return res.status(200).json(payload);
  });
};
