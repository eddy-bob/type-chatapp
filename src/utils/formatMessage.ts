import moment from "moment"
export const format = (name?: any, message?: string) => {
       return {
              name,
              message,
              time: moment().format("hh:mm:ss A")
       }
}