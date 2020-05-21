const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
  response.send("Server is live");
});


module.exports = router;