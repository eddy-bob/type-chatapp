
import { format } from "../utils/formatMessage"
import groupFunc from "../controllers/group.controllers"
import User from "../entities/User"
import { validateToken } from "../api/validateToken"
import { ObjectId } from "mongoose"
import groupChat from "../controllers/groupChat.controllers"
import Group from "../entities/Groups"
import privateChat from "../controllers/privateChat.controllers"
import { group } from "console"
const socketCon = {

       socketConnection: (io: any) => {
              const chatBot = "chatBot";
              var userData: any;
              var userId: ObjectId;
              var userFullName: string;
              const groupMethod = groupFunc()
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
                                   // rejoin all groups
                                   const groups = await Group.find({ members: { $in: [userId] } })
                                   if (groups[0]) {
                                          groups.forEach((group: any) => {
                                                 socket.join(group.name)
                                          });

                                   }




                                   userData = await User.findById(response.id)
                                   userId = userData._id;
                                   userFullName = userData.firstName + " " + userData.lastName
                                   // send welcome message to the user that just  the group chat


                                   socket.on("privateMessage", (data: any) => {
                                          privateChat.addChat(socket, data, userId, io, userFullName)
                                          // send a notification to the other users that a new message has just been recieved

                                          // send the new message all the users 
                                          // io.emit("message", format(userFullName, data.message))
                                   })
                                   // send a notification to all users that a user started typing
                                   // socket.on("typing", (data: any) => {
                                   //        io.to(data.socketId).emit("typing",format({name:userFullName,id:socket.id},"typing....."))


                                   socket.on("joinGroup", (data: any) => {

                                          groupMethod.joinGroup(data, socket, userId, userData)
                                   })
                                   socket.on("leaveGroup", (data: any) => {

                                          groupMethod.leaveGroup(data, socket, userId, userData)
                                   })
                                   // notify all the users that a user just left the chat

                                   socket.on("groupMessage", (data: string) => {

                                          groupChat.addChat(socket, data, userId, userData, io, userFullName)

                                   })
                                   socket.on("groupForward", (data: any[]) => {
                                          groupChat.forwardMessage(data, socket, userId, userData, userFullName, io)
                                   })
                                   socket.on("privateForward",
                                          socket.on("groupForward", (data: any[]) => {
                                                 privateChat.forwardMessage(data, socket, userId, userData, userFullName, io)
                                          }))
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