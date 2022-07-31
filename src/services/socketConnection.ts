
import { format } from "../utils/formatMessage"
import groupFunc from "../controllers/group.controllers"
import User from "../entities/User"
import { validateToken } from "../api/validateToken"
import { ObjectId } from "mongoose"
import groupChat from "../controllers/groupChat.controllers"
import Group from "../entities/Groups"
import privateChat from "../controllers/privateChat.controllers"
import socketAuth from "../utils/socket-auth"
const socketCon = {

       socketConnection: (io: any) => {
              const chatBot = "chatBot";
              var userData: any;
              var userId: ObjectId;
              var userFullName: string;
              const groupMethod = groupFunc()
              io.on("connection", async (socket: any) => {

                     let token = socket.handshake.headers.authorization;
                     socket.on('forceDisconnnect', () => {
                            socket.disconnect()
                            console.log("disconnected")
                     });

                     // if there is no auth header,disconnect connected socket
                     if (!token) {
                            socket.emit("noAuthDisconect", { statusCode: 401, message: "Unauthorized" })
                     }

                     if (token) {

                            const response = socketAuth(token)
                            if (!response.id) {
                                   socket.emit("noAuthDisconect", { statusCode: 401, message: "Unauthorized" })

                            } else {

                                   console.log(" socket connected")
                                   // rejoin all groups
                                   const groups = await Group.find({ members: { $in: [userId] } })
                                   if (groups[0]) {
                                          groups.forEach((group: any) => {
                                                 socket.join(group.name)
                                          });

                                   }

                                   userData = await User.findByIdAndUpdate(response.id,
                                          { $set: { socket: socket.id } },
                                          { new: true, runValidators: true })

                                   userId = userData._id;
                                   userFullName = userData.firstName + " " + userData.lastName
                                   // send welcome message to the user that just  the group chat


                                   socket.on("privateMessage", (data: { userId: ObjectId, message: string, attatchment: string[] }) => {
                                          privateChat.addChat(socket, data, userId, io, userFullName)
                                          console.log(data)
                                   })
                                   // send a notification  that a user started typing
                                   socket.on("typing", (data: any) => {
                                          socket.to(data.recipient).emit("typing", { value: data.value })
                                   })


                                   socket.on("joinGroup", (data: any) => {

                                          groupMethod.joinGroup(data, socket, userId, userData, userFullName)
                                   })
                                   socket.on("leaveGroup", (data: any) => {

                                          groupMethod.leaveGroup(data, socket, userId, userData, userFullName)
                                   })
                                   // notify all the users that a user just left the chat

                                   socket.on("groupMessage", (data: { groupId: ObjectId, message: string, attatchment: string[] }) => {
                                          console.log("fired", data)
                                          groupChat.addChat(socket, data, userId, userData, io, userFullName)

                                   })
                                   socket.on("groupForward", (data: any[]) => {
                                          groupChat.forwardMessage(data, socket, userId, userData, userFullName, io)
                                   })
                                   socket.on("privateForward",
                                          (data: any[]) => {
                                                 privateChat.forwardMessage(data, socket, userId, userData, userFullName, io)
                                          }),
                                          socket.on("disconnect", () => {
                                                 console.log("disconnected")
                                                 io.emit("left", format(userFullName, "went offline"))
                                          })
                            }
                     }


              })


       }
}


export { socketCon }