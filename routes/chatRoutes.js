const express = require("express");
const { Authenticate } = require("../middleware/generateToken");
const Chat = require("../models/ChatModel");
const router = express.Router();

router.post("/accesschat", Authenticate, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) throw new Error("No chat selected");

    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    }).populate([
      {
        path: "users",
        select: "name email avatar",
      },
      {
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "name email avatar",
        },
      },
    ]);
    console.log(isChat.length);
    if (isChat.length > 0) return res.json({ sucess: true, chat: isChat[0] });

    const chatData = new Chat({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    });
    const chat = await chatData.save();

    const newchat = await Chat.findOne({ _id: chat._id }).populate([
      {
        path: "users",
        select: "name email avatar",
      },
      {
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "name email avatar",
        },
      },
    ]);
    return res.json({ sucess: true, chat: newchat });
  } catch (error) {
    return res.json({ sucess: false, message: error.message });
  }
});

router.route("/fetchchats").get(Authenticate, async (req, res) => {
  try {
    const userChats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate([
        {
          path: "users",
          select: "name email avatar",
        },
        {
          path: "latestMessage",
          populate: {
            path: "sender",
            select: "name email avatar",
          },
        },
        {
          path: "groupAdmin",
        },
      ])
      .sort({ updatedAt: -1 });
    return res.json({ sucess: true, userChats });
  } catch (error) {
    return res.json({ sucess: false, message: error.message });
  }
});

router.route("/group").post(Authenticate, async (req, res) => {
  try {
    const { name, users } = req.body;
    if (!name || !users) throw new Error("ALL FIELDS REQUIRED");
    var groupchatusers = JSON.parse(users);
    if (!(groupchatusers.length > 1))
      throw new Error("BHOSDIKE GROUP CHAT HAI ");
    groupchatusers.push(req.user._id);
    const chatData = new Chat({
      chatName: name,
      users: groupchatusers,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const groupChat = await chatData.save();
    return res.json({ sucess: true, groupChat });
  } catch (error) {
    return res.json({ sucess: false, message: error.message });
  }
});

router.route("/rename").put(Authenticate, async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    if (!chatId || !chatName) throw new Error("PARAMETERS MISSING");
    const updateChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      { new: true }
    ).populate([
      {
        path: "users",
        select: "name email avatar",
      },
      {
        path: "groupAdmin",
        select: "name email password",
      },
    ]);
    return res.json(updateChat);
  } catch (error) {
    return res.json({ sucess: false, message: error.message });
  }
});

router.route("/groupadd").put(Authenticate, async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const updateChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    ).populate([
      {
        path: "users",
        select: "name email avatar",
      },
      {
        path: "groupAdmin",
        select: "name email password",
      },
    ]);
    if (!updateChat) throw new Error("NO CHAT FOUND TO ADD USER");
    return res.json(updateChat);
  } catch (error) {
    return res.json({ sucess: false, message: error.message });
  }
});

router.route("/groupremove").put(Authenticate, async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const updateChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    ).populate([
      {
        path: "users",
        select: "name email avatar",
      },
      {
        path: "groupAdmin",
        select: "name email password",
      },
    ]);
    if (!updateChat) throw new Error("NO CHAT FOUND TO REMOVE USER");
    return res.json(updateChat);
  } catch (error) {
    return res.json({ sucess: false, message: error.message });
  }
});

module.exports = router;
