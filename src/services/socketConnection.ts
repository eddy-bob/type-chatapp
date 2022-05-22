const socketConnection = (io: any) => {
       io.on("connection", (socket: any): void => {
              console.log("User connection".underline.green)
       })
}
export default socketConnection