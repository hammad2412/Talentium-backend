const devOnly = (req, res, next) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({ message: "Not allowed" });
  }
  next();
};

export default devOnly;
