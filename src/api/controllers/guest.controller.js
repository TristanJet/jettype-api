const { sessionExists } = require("../../repository");
const createGuest = require("../services/createguest.service");
const cookieSecurity = require("../utility/cookieSecurity");

console.log(cookieSecurity);

const guestcontroller = async (req, res, next) => {
  try {
    if (
      !req.cookies["jet-session"] ||
      !(await sessionExists(req.cookies["jet-session"]))
    ) {
      const sessionId = await createGuest();
      if (sessionId) {
        res.status = 201;
        res.cookie("jet-session", sessionId, {
          maxAge: 600000 * 1000, // 1 week in milliseconds
          httpOnly: true,
          path: "/",
          secure: cookieSecurity,
          sameSite: "Strict",
        });
        res.json({
          message: "Guest user created.",
          timestamp: new Date().toISOString(),
        });
      } else {
        throw new Error("Guest user || session creation failed");
      }
    } else {
      res.json({
        message: "Session already exists",
        token: req.cookies["jet-session"],
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err) {
    return next(err);
  }
};

module.exports = guestcontroller;
