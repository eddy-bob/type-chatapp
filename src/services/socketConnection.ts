import { format } from "../utils/formatMessage";
import groupFunc from "../controllers/group.controllers";
import User from "../entities/User";
import { validateToken } from "../api/validateToken";
import { ObjectId } from "mongoose";
import groupChat from "../controllers/groupChat.controllers";
import Group from "../entities/Groups";
import privateChat from "../controllers/privateChat.controllers";
import socketAuth from "../utils/socket-auth";
import video from "../controllers/video.controller";

const socketCon = {
  socketConnection: (io: any) => {
    // const setDetails = async (response: any) => {
    //        userData = await User.findById(response.id)
    //        userId = userData._id as ObjectId;
    //        userFullName = userData.firstName + " " + userData.lastName
    //        return [userId, userFullName]
    // }
    var con: any = {};
    const userDet: any = {};
    var userData: any;
    var userId: ObjectId;
    var userFullName: string;
    const groupMethod = groupFunc();
    io.on("connection", async (socket: any) => {
      let token = socket.handshake.headers.authorization;

      socket.on("forceDisconnnect", () => {
        socket.disconnect();
        console.log("disconnected");
      });

      // if there is no auth header,disconnect connected socket
      if (!token) {
        socket.emit("noAuthDisconect", {
          statusCode: 401,
          message: "Unauthorized",
        });
      }

      if (token) {
        const response = socketAuth(token);
        if (!response.id) {
          socket.emit("noAuthDisconect", {
            statusCode: 401,
            message: "Unauthorized",
          });
        } else {
          userData = await User.findById(response.id);
          userId = userData._id as ObjectId;
          userFullName = userData.firstName + " " + userData.lastName;

          if (userId) {
            con[userId as any] = socket.id;
            userDet[userId as any] = userFullName;

            console.log(" socket connected");
            // rejoin all groups
            // join private group
            socket.join(userId);
            const groups = await Group.find({ members: { $in: [userId] } });
            if (groups[0]) {
              groups.forEach((group: any) => {
                socket.join(group.name);
              });
            }

            // send welcome message to the user that just  the group chat

            socket.on(
              "privateMessage",
              async (data: {
                userId: ObjectId;
                message: string;
                attatchment: string[];
                friendId: ObjectId;
              }) => {
                let token = socket.handshake.headers.authorization;
                const response = socketAuth(token);
                // recompute the user's data
                privateChat.addChat(
                  socket,
                  data,
                  response.id as ObjectId,
                  io,
                  userDet[[response.id] as any] as string,
                  con
                );
                console.log(data);
              }
            );
            // send a notification  that a user started typing
            socket.on("typing", (data: any) => {
              socket
                .to(con[[data.recipient] as any])
                .emit("typing", { value: data.value });
            });

            socket.on("joinGroup", (data: any) => {
              groupMethod.joinGroup(
                data,
                socket,
                userId,
                userData,
                userFullName
              );
            });
            socket.on("leaveGroup", (data: any) => {
              groupMethod.leaveGroup(
                data,
                socket,
                userId,
                userData,
                userFullName
              );
            });
            // notify all the users that a user just left the chat

            socket.on(
              "groupMessage",
              async (data: {
                groupId: ObjectId;
                message: string;
                attatchment: string[];
              }) => {
                console.log("fired", data);

                let token = socket.handshake.headers.authorization;
                const response = socketAuth(token);
                userData = await User.findById(response.id);
                // recompute the user's data
                console.log(userDet[[response.id] as any]);
                groupChat.addChat(
                  socket,
                  data,
                  response.id as ObjectId,
                  userData,
                  io,
                  userDet[[response.id] as any]
                );
              }
            );
            socket.on("groupForward", async (data: any[]) => {
              console.log("fired", data);

              let token = socket.handshake.headers.authorization;
              const response = socketAuth(token);
              userData = await User.findById(response.id);
              groupChat.forwardMessage(
                data,
                socket,
                response.id as ObjectId,
                userData,
                userFullName,
                io
              );
            });
            socket.on("privateForward", async (data: any[]) => {
              let token = socket.handshake.headers.authorization;
              const response = socketAuth(token);
              userData = await User.findById(response.id);
              privateChat.forwardMessage(
                data,
                socket,
                response.id as ObjectId,
                userData,
                userDet[[response.id] as any],
                io
              );
            }),
              socket.on("private_call_init", async () => {});
            socket.on("private_call_answer", async () => {});
            socket.on("private_call_reject", async () => {});
            socket.on("private_call_end", async () => {});

            socket.on(
              "private_video_call_init",
              async (id: string, peerId: string) => {
                const socketReference = con[[id] as any];
                await video.startVideoCall(
                  socket,
                  io,
                  userId,
                  userFullName,
                  id,
                  socketReference,
                  peerId
                );
              }
            );

            socket.on(
              "private_video_call_answer",
              async (callerId: ObjectId, callId: ObjectId, peerId: string) => {
                const socketReference = con[[callerId] as any];
                await video.updateCallStatus(
                  socket,
                  io,
                  userId,
                  callId,
                  userFullName,
                  {
                    status: "ACCEPTED",
                    callerId,
                    socketReference,
                    callerName: userDet[[callerId] as any],
                    peerId,
                  }
                );
              }
            );

            socket.on(
              "private_video_call_reject",
              async (callerId: ObjectId, callId: ObjectId, peerId: string) => {
                const socketReference = con[[callerId] as any];
                await video.updateCallStatus(
                  socket,
                  io,
                  userId,
                  callId,
                  userFullName,
                  {
                    status: "REJECTED",
                    callerId,
                    socketReference,
                    callerName: userDet[[callerId] as any],
                    peerId,
                  }
                );
              }
            );

            socket.on("private_video_call_end", async () => {
              async (callerId: ObjectId, callId: ObjectId, peerId: string) => {
                const socketReference = con[[callerId] as any];
                await video.updateCallStatus(
                  socket,
                  io,
                  userId,
                  callId,
                  userFullName,
                  {
                    status: "ENDED",
                    callerId,
                    socketReference,
                    callerName: userDet[[callerId] as any],
                    peerId,
                  }
                );
              };
            });
            socket.on("disconnect", () => {
              console.log("disconnected");
              io.emit("left", format(userFullName, "went offline"));
            });
          }
        }
      }
    });
  },
};

export { socketCon };
