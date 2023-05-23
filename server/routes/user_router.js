const router = require("express").Router();
const user = require("../controllers/user_controller");

router.post("/register", user.register);
router.get("/admin-only", user.isAdmin, (req, res) => {
  S; // Handle the admin-only request
  res.json({ message: "Admin access granted." });
});

module.exports = router;
