export const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // Chat message event
    socket.on('chat', (payload) => {
      console.log("💬 Received payload:", payload);
      io.emit('chat', payload);
    });

    // Order status update event
    socket.on('orderStatusUpdate', (orderData) => {
      console.log('📦 Order status update:', orderData);
      io.emit('orderStatusUpdate', orderData);
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });
};
