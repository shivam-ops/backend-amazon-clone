const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { response, request } = require("express");
const stripe = require("stripe")(
  "sk_test_51HUaasB55GJzZDkW3VvrDkJaebzX72tVNRehN03A84CqZ3aTLQu0xFCV6i7mAVabB3I7aPuqaskeM8AKtYxoBxTp001PWvyzCD"
);

// Setting up the API
// - App Config
const app = express();

// - Middlewares
app.use(
  cors({
    origin: true,
  })
);

//allow us to send data in json and parse the same
app.use(express.json());

// - API routes

app.get("/", (request, response) => {
  response.status(200).send("Welcome to serverless computing");
});

app.post("/payments/create", async (request, response) => {
  const total = request.query.total;
  console.log("Payment request received with total + ", total);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total, // total is in the subunits of the currency
    currency: "usd",
    description: "Amazon",
  });

  // 201 : OK - Created
  response.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});

// - Listen command
exports.api = functions.https.onRequest(app);

// local API URL (Example endpoint):
//  http://localhost:5001/clone-6de06/us-central1/api
