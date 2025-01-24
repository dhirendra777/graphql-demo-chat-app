var { buildSchema } = require("graphql");

const typeDefs = buildSchema(`
    type Query {
        users: [User]
        chats: [Chat]
    }

    type User {
        id: String
        name: String
        chats: [Chat]
    }

    type Chat {
        id: String
        sender: User
        message: String
    }

    type Mutation {
        sendMessage(sender: String, message: String): Chat
        enterRoom(name: String): User
        leaveRoom(name: String): Boolean
    }

    type Subscription {
        messageSent: [Chat]
    }

`);

module.exports = typeDefs;
