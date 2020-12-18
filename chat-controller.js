export default class ChatController {
  constructor({
    messagesDiv = "messages",
    messageForm = "message-form",
    userInput = "user-name",
    messageInput = "user-message",
    buttonShowAllMessages = "show-all-messages",
    messagesLimit = 5,
    chatServer = "ws://35.157.80.184:8080/",
  }) {
    this.messagesDiv = document.getElementById(messagesDiv);
    this.messageForm = document.getElementById(messageForm);
    this.userInput = document.getElementById(userInput);
    this.messageInput = document.getElementById(messageInput);
    this.buttonShowAllMessages = document.getElementById(buttonShowAllMessages);
    this.messagesLimit = messagesLimit;
    this.messages = [];
    this.showAllMessages = messagesLimit === 0 ? true : false;

    this.socket = io(chatServer);

    this.setEventListeners();
    this.setSocketListener();
  }

  setEventListeners() {
    this.messageForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const data = {
        user: this.userInput.value,
        message: this.messageInput.value,
      };
      this.messages.push({ ...data, selfUser: true });
      // console.log(this.messages);
      this.socket.emit("message", data);
    });

    this.buttonShowAllMessages.addEventListener("click", (evt) => {
      this.buttonShowAllMessages.innerHTML = !this.showAllMessages
        ? `Show last ${this.messagesLimit} messages`
        : "Show all messages";
      this.togleShowAllMessages();
    });
  }

  setSocketListener() {
    this.socket.on("message", (data) => {
      this.addMessage(data);
      // console.log("message", data);
      let lm = this.messages[this.messages.length - 1];
      if (
        data.user != this.userInput.value ||
        data.message != this.messageInput.value
      )
        this.messages.push(data);
    });
  }

  addMessage(data) {
    if (!this.showAllMessges && this.messages.length > this.messagesLimit) {
      let temp = this.messagesDiv.innerHTML.split("</p>");
      temp.shift();
      this.messagesDiv.innerHTML = temp.join("</p>");
    }
    if (data.user === this.userInput.value) {
      this.messagesDiv.innerHTML += `<p class="self-user"> ${data.message}</p>`;
      this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
      return;
    }
    this.messagesDiv.innerHTML += `<p>${data.user}: ${data.message}</p>`;
    this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
  }

  togleShowAllMessages() {
    this.showAllMessages = !this.showAllMessages;
    this.resetMessages();
  }
  resetMessages() {
    let tempMessagesHTML = "";
    let dn = this.showAllMessages ? this.messages.length : this.messagesLimit;
    let n = this.messages.length;
    let start = n - dn >= 0 ? n - dn : 0;
    //console.log(n, dn, this.messages);
    for (let i = start; i < n; i++) {
      let msg = this.messages[i];
      //console.log(i, msg);
      tempMessagesHTML += msg?.selfUser
        ? `<p class="self-user"> ${msg.message}</p>`
        : `<p>${msg.user}: ${msg.message}</p>`;
    }
    this.messagesDiv.innerHTML = tempMessagesHTML;
    this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
  }
}
