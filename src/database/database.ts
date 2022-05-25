import endPoint from "../config/endpoints.config"
// import { Connection, ConnectionManager, ConnectionOptions, createConnection, getConnectionManager } from 'typeorm';
// import { User } from "../entities/User"
import { MongoClient, Db } from "mongodb"

const database = async () => {

       // let myConnection: Connection;
       // const hasConnection = getConnectionManager().has(endPoint.mongoName);
       // if (hasConnection) {
       //        myConnection = getConnectionManager().get(endPoint.mongoName);
       //        if (!myConnection.isConnected) {
       //               myConnection = await myConnection.connect();
       //        }
       // }
       // else {
       //        const connectionOptions: ConnectionOptions = {
       //               type: "mongodb",
       //               name: 'default',
       //               url: endPoint.mongoString,
       //               useNewUrlParser: true,
       //               ssl: true,
       //               synchronize: true,
       //               logging: false,
       //               useUnifiedTopology: true,
       //               entities: [
       //                      User
       //               ]
       //        }
       //        const connection = await createConnection(connectionOptions)

       //        if (connection.isInitialized == true) { console.log(`Successfully connected to database: ${connection.name}`.blue); }
       //        return connection.getRepository(rep)
              const client: MongoClient = new MongoClient(endPoint.mongoString);

              await client.connect();

              const db: Db = client.db(endPoint.mongoName);


              console.log(`Successfully connected to database: ${db.databaseName}`.blue);
       
}
export default database