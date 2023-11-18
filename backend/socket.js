var io;

module.exports = {
  init: (httpserver) => {
    io = require("socket.io")(httpserver, {
      cors: {
        origin: "http://localhost:9000",
        methods: ["GET", "POST"],
      },
    });
    return io;
  },
  getio: () => {
    if (io) {
      console.log("io is already initialized");
    }
    return io;
  },
};
