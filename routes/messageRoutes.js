const express = require("express");
const { Authenticate } = require("../middleware/generateToken");
const Chat = require("../models/ChatModel");
const router = express.Router();
const Message = require("../models/MessageModel");

router.route("/sendMessage").post(Authenticate, async (req, res) => {
  try {
    const { content, chatId } = req.body;
    if (!chatId) throw new Error("No Chat to send");
    const messageData = new Message({
      sender: req.user._id,
      content: content,
      chat: chatId,
    });

    let message = await messageData.save();
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      {
        latestMessage: message,
      },
      { new: true }
    );
    message = await Message.find({ _id: message._id }).populate([
      {
        path: "sender",
        select: "_id name email avatar",
      },
      {
        path: "chat",
        populate: {
          path: "users",
          select: "_id name email avatar",
        },
      },
    ]);
    return res.json({ sucess: true, message });
  } catch (error) {
    return res.json({ sucess: false, message: error.message });
  }
});

router.route("/:chatId").get(Authenticate, async (req, res) => {
  try {
    if (!req.params.chatId) throw new Error("No chat Selected");
    const messages = await Message.find({ chat: req.params.chatId }).populate([
      { path: "sender", select: "name email avatar" },
      { path: "chat" },
    ]);
    return res.json({ sucess: true, messages });
  } catch (error) {
    return res.json({ sucess: false, message: error.message });
  }
});

module.exports = router;
