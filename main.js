import ChatController from "./chat-controller.js";
/*
chat defaut config:
{
  messagesDiv = "messages",
  messageForm = "message-form",
  userInput = "user-name",
  messageInput = "user-message",
  buttonShowAllMessages = "show-all-messages",
  messagesLimit = 5,
  chatServer = "ws://35.157.80.184:8080/",
}
*/
const chat = new ChatController({});
