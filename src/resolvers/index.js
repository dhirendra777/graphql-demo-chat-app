const { v4: uuidv4 } = require("uuid");

const chatCollection = [],
  users = [],
  CHAT_CHANNEL = "CHAT_CHANNEL";

const resolvers = {
  Query: {
    users: () => users,
    chats: () => {
      return chatCollection;
    },
  },
  Mutation: {
    enterRoom: (_, userDetails) => {
      const user = { id: uuidv4(), ...userDetails };
      users.push(user);
      return { ...user, chats: chatCollection };
    },
    sendMessage: (_, messageDetails, { pubsub }) => {
      const sender = users.find((user) => user.id === messageDetails.sender); //get sender info
      const chat = { id: uuidv4(), sender, message: messageDetails.message }; //create chat with chat id
      pubsub.publish("CHAT_CHANNEL", { messageSent: chat }); //publish it to the subscribers
      chatCollection.push(chat); // update the chats
      return chat;
    },
    leaveRoom: (_, userDetails) => {
      const userName = userDetails.name || "";
      const index = users.findIndex((user) => user.name === userName);
      return index > -1 ? !!users.splice(index, 1) : false;
    },
  },
  User: {
    chats(parent) {
      return chatCollection.filter((item) => item.sender.id === parent.id);
    },
  },
  Subscription: {
    messageSent: {
      subscribe: (_, _args, { pubsub }) => {
        pubsub.asyncIterator(CHAT_CHANNEL);
      },
    },
  },
};

module.exports = resolvers;
