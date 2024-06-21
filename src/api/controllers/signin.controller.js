const handleSignIn = require("../services/signin.service");
const cookieSecurity = require("../utility/cookieSecurity");

const signincontroller = async (req, res, next) => {
  try {
    const sessionId = await handleSignIn(req);
    res.status = 201;
    res.cookie("jet-session", sessionId, {
      maxAge: 2600000 * 3 * 1000, // 3 months in milliseconds
      httpOnly: true,
      path: "/",
      secure: cookieSecurity,
      sameSite: "Strict",
    });
    res.json({
      message: "signin successful",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = signincontroller;
