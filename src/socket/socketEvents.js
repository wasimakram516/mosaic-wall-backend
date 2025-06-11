
const socketHandler = (io) => {
  io.on("connection", async (socket) => {
    console.log(`🔵 New client attempted to connect: ${socket.id}`);

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    // 🔁 Send all display media to all clients
    const sendInitialMedia = async () => {
      try {
        const media = await DisplayMedia.find();
        io.emit("mediaUpdate", media);
      } catch (error) {
        console.error("❌ Failed to send media on init:", error);
      }
    };

    await sendInitialMedia();

    socket.on("register", async (role) => {
      socket.role = role;
      console.log(`👤 Client ${socket.id} registered as ${role}`);

      try {
        const media = await DisplayMedia.find();
        socket.emit("mediaUpdate", media);
      } catch (error) {
        console.error("❌ Failed to emit media on register:", error);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ Client disconnected: ${socket.id} - Reason: ${reason}`);
    });
  });
};

module.exports = socketHandler;
