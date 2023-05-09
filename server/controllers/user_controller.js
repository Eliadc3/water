const jwt = require("jsonwebtoken");
const User = require("../models/User_model");
const validator = require("email-validator");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  let user;

  try {
    // יש ערכים בשדה
    // בדיקה שיוזר ומייל לא קיימים
    // בדיקה שעונה על דרישות סיסמה
    // בדיקה של 2 תווים ומעלה
    // בדיקה שמייל תקין

    if (!username || !email || !password) {
      return res.status(400).json({ message: "You must fill all the fields." });
    }

    if (username.length < 2) {
      return res
        .status(400)
        .json({ message: "Username has to be at least 2 characters." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password has to be at least 8 characters." });
    }

    //test email
    if (!validator.validate(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res
        .status(400)
        .json({ message: "Email adress already exists, try another email." });
    }

    // להצפין את  הסיסמה
    // לשמור ב-DB
    // לבדוק אם נשמר בהצלחה

    // הצפנת הסיסמה
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // שמירה ב-DB
    user = new User({
      username,
      email,
      password: hashPassword,
    });

    await user.save();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
  if (!user) {
    return res.status(500).json({ message: "Error. User not created." });
  }
  return res.status(201).json({ message: "User created successfully.", user });
};
