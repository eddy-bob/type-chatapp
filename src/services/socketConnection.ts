
import { format } from "../utils/formatMessage"
import groupFunc from "../controllers/group.controllers"
import User from "../entities/User"
import { validateToken } from "../api/validateToken"
import { ObjectId } from "mongoose"
const socketCon = {

       socketConnection: (io: any) => {
              const chatBot = "chatBot";
              var userData: any;
              var userId: ObjectId;
              var userFullName: string;
              return io.on("connection", async (socket: any) => {
                     let token = socket.handshake.headers.authorization.split(" ")[1];


                     socket.on('forceDisconnnect', () => {
                            socket.disconnect()
                            console.log("disconnected")
                     });

                     // if there is no auth header,disconnect connected socket
                     if (!token) {
                            socket.emit("noAuthDisconect", { statusCode: 401, message: "Unauthorized" })
                     }

                     if (token) {

                            const response = validateToken(token)

                            if (!response.id) {
                                   socket.emit("noAuthDisconect", { statusCode: 401, message: "Unauthorized" })
                            } else {
                                   console.log("connected")
                                   userData = await User.findById(response.id)
                                   userId = userData._id;
                                   userFullName = userData.firstName + " " + userData.lastName
                                   // send welcome message to the user that just  the group chat
                                   socket.emit('welcome', format("", "Welcome to node-chat-app")),

                                          socket.on("newJoin", (data: any) => {// send a message to the other users except the new user that someone just joined the chat
                                                 socket.broadcast.emit("newJoin", format(data.name))
                                          })
                                   socket.on("message", (data: any) => {
                                          // send a notification to the other users that a new message has just been recieved
                                          socket.broadcast.emit("newMessage", "A new message recieved")
                                          // send the new message all the users 
                                          io.emit("message", format(userFullName, data.message))
                                   })
                                   // send a notification to all users that a user started typing
                                   socket.on("typing", (data: any) => {
                                          socket.broadcast.emit("typing", {
                                                 name: data.name,
                                                 message: "typing..."
                                          })
                                   })


                                   socket.on("joinGroup", (data: any) => {
                                          const groupMethod = groupFunc()
                                          groupMethod.joinGroup(data, socket, userId, userData)
                                   })
                                   socket.on("leaveGroup", (data: any) => {
                                          const groupMethod = groupFunc()
                                          groupMethod.leaveGroup(data, socket, userId, userData)
                                   })
                                   // notify all the users that a user just left the chat

                                   socket.on("disconnect", () => {
                                          console.log("disconnected")
                                          io.emit("left", format(userFullName, "went offline"))
                                   })
                            }
                     }


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