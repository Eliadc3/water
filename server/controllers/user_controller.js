const jwt = require("jsonwebtoken");
const User = require("../models/User");
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
      return res.status(400).json({ message: "נא למלא את כל השדות." });
    }

    if (username.length < 2) {
      return res
        .status(400)
        .json({ message: "שם המשתמש צריך להכיל לפחות 2 תווים." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "הסיסמה צריכה להכיל לפחות 8 תווים." });
    }

    //test email
    if (!validator.validate(email)) {
      return res.status(400).json({ message: "המייל שהוזן אינו תקין." });
    }

    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      return res
        .status(400)
        .json({ message: "שם המשתמש כבר קיים, נא לבחור שם אחר." });
    }

    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res
        .status(400)
        .json({ message: "כתובת מייל כבר קיימת, נא לבחור מייל אחר." });
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
    return res.status(500).json({ message: "משתמש לא נוצר, התחרשה שגיאה." });
  }
  return res.status(201).json({ message: "הרישום בוצע בהצלחה", user });
};
