import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
  };

  try {
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN, {
      expiresIn: "15m",
    });

    return token;
  } catch (error) {
    throw new Error("Token generate error", error.message);
  }
};

export const generateRefreshToken = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
  };

  try {
    const token = jwt.sign(payload, process.env.REFRESH_TOKEN, {
      expiresIn: "5m",
    });

    return token;
  } catch (error) {
    throw new Error("Token generate error", error.message);
  }
};