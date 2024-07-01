const express = require("express");
const {
  createTopic,
  getAllTopic,
  getSingleTopic,
  deleteTopicById,
  updateTopicById,
} = require("./topicController");
const { authenticateToken, isAdmin } = require("../middlewares/authHandle");

const topicRouter = express.Router();

topicRouter.post("/createTopic", authenticateToken, isAdmin, createTopic);
topicRouter.get("/getAllTopic", getAllTopic);
topicRouter.get("/getSingleTopic/:id", authenticateToken, getSingleTopic);
topicRouter.put(
  "/updateTopic/:id",
  authenticateToken,
  isAdmin,
  updateTopicById
);
topicRouter.delete(
  "/deleteTopic/:id",
  authenticateToken,
  isAdmin,
  deleteTopicById
);

module.exports = topicRouter;
