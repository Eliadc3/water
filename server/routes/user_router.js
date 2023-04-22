const router = require("express").Router();
const user = require("../controllers/user_controller");

router.post("/register", user.register);

module.exports = router;
