const mongoose = require("mongoose");
const createError = require("http-errors");
const topicModel = require("./topicModel");

const createTopic = async (req, res, next) => {
  const { topic, description, difficulty } = req.body;
  if (!topic || !description) {
    const error = createError(400, "Please, fill all the fields.");
    return next(error);
  }

  try {
    const topicExist = await topicModel.findOne({ topic });
    if (topicExist) {
      const error = createError(400, "Topic already exists.");
      return next(error);
    }

    const createdBy = new mongoose.Types.ObjectId(req.user.sub);

    const newTopic = await topicModel.create({
      topic,
      description,
      difficulty,
      createdBy,
    });

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Topic Created successfully",
        Topic: newTopic,
      },
    });
  } catch (error) {
    next(
      createError(
        500,
        `Server error while adding a new topic. ${error.message}`
      )
    );
  }
};

const getAllTopic = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  if (limit > 5) {
    return res.status(400).json({
      StatusCode: 400,
      IsSuccess: false,
      ErrorMessage: "Limit cannot exceed more than 5",
    });
  }

  const skip = (page - 1) * limit;

  try {
    const topics = await topicModel.aggregate([
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const totalTopics = topics[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalTopics / limit);
    const message =
      topics[0].data.length <= 0
        ? "No topics were created"
        : "Successfully fetched all topics";

    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message,
        Topics: topics[0].data,
        pagination: {
          totalTopics,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
      },
    });
  } catch (error) {
    next(
      createError(
        500,
        `Server error while fetching the topics. ${error.message}`
      )
    );
  }
};

const getSingleTopic = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  try {
    const topicDetails = await topicModel.findById(id);
    if (!topicDetails) {
      return next(createError(400, "Topic details not found"));
    }
    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Successfully got single topic",
        Topic: topicDetails,
      },
    });
  } catch (error) {
    next(
      createError(500, `Server error while getting the topic. ${error.message}`)
    );
  }
};

const updateTopicById = async (req, res, next) => {
  const { id } = req.params;
  const { topic, description, difficulty } = req.body;
  const updatedBy = new mongoose.Types.ObjectId(req.user.sub);
  try {
    const updatedTopic = await topicModel.findByIdAndUpdate(
      id,
      { topic, description, difficulty, updatedBy },
      { new: true }
    );
    if (!updatedTopic) {
      return next(createError(404, "Topic details not found"));
    }
    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Successfully updated topic",
        Topic: updatedTopic,
      },
    });
  } catch (error) {
    next(
      createError(
        500,
        `Server error while updating the topic. ${error.message}`
      )
    );
  }
};

const deleteTopicById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedTopic = await topicModel.findByIdAndDelete(id);
    if (!deletedTopic) {
      return next(createError(404, "Topic details not found"));
    }
    res.status(200).json({
      StatusCode: 200,
      IsSuccess: true,
      ErrorMessage: [],
      Result: {
        message: "Successfully deleted topic",
        Topic: deletedTopic,
      },
    });
  } catch (error) {
    next(
      createError(
        500,
        `Server error while deleting the topic. ${error.message}`
      )
    );
  }
};

module.exports = {
  createTopic,
  getAllTopic,
  getSingleTopic,
  updateTopicById,
  deleteTopicById,
};
