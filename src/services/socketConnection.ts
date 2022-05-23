const socketConnection = (io: any) => {
       io.on("connection", (socket: any): void => {
              // emit message to all users that some user connected
              io.emit('connection', `${socket.id} connected`);
              console.log(`User with id ${socket.id} connected`.underline.green)
              socket.on("message", (data: string) => { console.log(data) })
              // on disconnect emit message to user that some user disconnected
              socket.on('disconnect', function () {
                     io.emit('logout', `${socket.id} disconnected`);
                     console.log("user disconnected")
              });
       })


}
export default socketConnection