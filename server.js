const http = require("http");
const app = require("./app");

const port = process.env.SERVER_PORT;

const httpServer = http.createServer(app);

const { init } = require("./src/helper/SocketUtil");
init(httpServer);

httpServer.listen(port, () =>
    console.log(`Server started, listening on port ${port}!`)
);
