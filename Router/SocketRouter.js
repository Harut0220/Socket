import express from "express";

const viewsRouter = express.Router();

viewsRouter.get("/video", (req, res) => {
  res.render("Views");
});

export default viewsRouter;

