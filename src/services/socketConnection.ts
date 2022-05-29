
import { format } from "../utils/formatMessage"

const socketCon = {

       socketConnection: (io: any) => {
              const chatBot = "chatBot"
              return io.on("connection", (socket: any): any => {
                     console.log("connected")
                     // send welcome message to the user that just joined
                     socket.emit('welcome', format("", "Welcome to node-chat-app")),

                            socket.on("newJoin", (data: any) => {// send a message to the other users except the new user that someone just joined the chat
                                   socket.broadcast.emit("newJoin", format(data.name))
                            })
                     socket.on("message", (data: any) => {
                            // send a notification to the other users that a new message has just been recieved
                            socket.broadcast.emit("newMessage", "A new message recieved")
                            // send the new message all the users 
                            io.emit("message", format(data.name, data.message))
                     })
                     // send a notification to all users that a user started typing
                     socket.on("typing", (data: any) => {
                            socket.broadcast.emit("typing", {
                                   name: data.name,
                                   message: "typing..."
                            })
                     })

                     // notify all the users that a user just left the chat

                     socket.on("disconnect", () => {
                            console.log("disconnected")
                            io.emit("left", format("eddy", "left"))
                     })


                     // joinGroup: (groupName: string, userName: string) => {
                     //        socket.join(groupName)
                     //        //tell all the other groups that a user joined
                     //        socket.broadcast.to(groupName).emit("groupJoin", format(userName, "joined group"))
                     // },
                     // test: "madu"

                     return socket
              })


       }
}


export { socketCon }