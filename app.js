const express = require('express');
const app = express();
const cors = require("cors");
const mercadopago = require('mercadopago');

const port = process.env.PORT || 4000;

mercadopago.configure({
  access_token: "APP_USR-4807202384862994-103114-49440eef791db90d4231079483622d7d-1217589503"
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    messege: "home page"
  });
});

app.post("/create_preference", (req, res) => {

  const items = req.body;

  const preference = {
    items,
    back_urls: {
      "success": "http://localhost:8080/feedback",
			"failure": "http://localhost:8080/feedback",
			"pending": "http://localhost:8080/feedback"
    },
    auto_return: "approved",
  }

  mercadopago.preferences.create(preference)
  .then(function (response) {
    res.json({
      response
    });
  })
  .catch(function (error) {
    console.log(error);
  });

  app.get('/feedback', function (req, res) {
    res.json({
      Payment: req.query.payment_id,
      Status: req.query.status,
      MerchantOrder: req.query.merchant_order_id
    });
  });

});

app.listen(port, () => console.log("servidor rodando na porta 4000"));