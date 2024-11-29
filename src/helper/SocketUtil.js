const socketio = require("socket.io");
const jwt = require("jsonwebtoken");
const {
  countUnreadNotification,
  getNotification,
} = require("../model/Notification");
const { Redis } = require("../helper/RedisUtil");

const http = require("http");
const app = require("../../app");

let io;

const init = (server) => {
  io = socketio(server, {
    cors: {
      origin: "*",
    },
  });

  io.sockets.use(SocketFilter());

  io.sockets.on("connection", async function (socket) {
    socket.join(socket.decoded.userId);
  });

  return io;
};

const getIO = () => {
  if (!io) {
    const httpServer = http.createServer(app);
    init(httpServer);
  }
  return io;
};

function SocketFilter() {
  return (socket, next) => {
    const response = {
      statusCode: 401,
    };
    var token = socket.handshake.query.token;
    if (!token) {
      response.messages = ["Token is missing"];
      return next(new Error(JSON.stringify(response)));
    }

    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
      if (err) {
        response.messages = ["Token is not valid"];
        return next(new Error(JSON.stringify(response)));
      }

      // Assign decoded data from token
      socket.decoded = decoded;

      // Multiple login tidak bisa dilakukan saat ENV test untuk mempermudah testing
      if (process.env.ENV != "test") {
        const redisClient = await Redis.getClient();
        const latestToken = await redisClient.get(
          `SCM_token_${socket.decoded.userId}`
        );
        if (token != latestToken) {
          response.messages = [
            "It looks like you are already logged in to another tab or browser. To log in, please close or log out of any other tabs or windows where you are logged in.",
          ];
          return next(new Error(JSON.stringify(response)));
        }
      }

      return next();
    });
  };
}

async function sendTotalUnreadNotification(receiver) {
  let response;

  const result = await countUnreadNotification(receiver);

  if (result.err) {
    console.log(result.err);
    response = {
      statusCode: 500,
      messages: ["Internal Server Error"],
    };
  } else {
    response = {
      statusCode: 200,
      messages: "Data total unread notification found",
      data: result,
    };
  }

  getIO().to(receiver.userId).emit("getTotalUnreadNotification", response);
}

module.exports = {
  init,
  getIO,
  sendTotalUnreadNotification,
};
