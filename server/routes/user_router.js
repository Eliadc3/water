const router = require("express").Router();
const user = require("../controllers/user_controller");

/* Register router with passport package */
router.post("/register", user.register);

/* Login router */
router.post("/login", user.login);

/* Logout router  */
router.get("/logout", user.logout);

router.get("/admin-only", user.isAdmin, (req, res) => {
  S; // Handle the admin-only request
  res.json({ message: "Admin access granted." });
});

module.exports = router;
