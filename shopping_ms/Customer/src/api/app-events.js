const CustomerServices = require("../services/customer-service");

module.exports = (app) => {
  const service = new CustomerServices();
  app.use("/app-events", async (req, res, next) => {
    const { payload } = req.body;
    service.SubscribeEvents(payload);
    console.log(
      "================ shopping service received Event ============"
    );
    return res.status(200).json(payload);
  });
};
