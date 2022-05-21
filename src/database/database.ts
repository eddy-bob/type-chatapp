import endPoint from "../config/endpoints.config"
import "reflect-metadata";
import { createConnection } from "typeorm";

// import { MongoClient, Db } from "mongodb"

const database = async () => {

       const connection = await createConnection({
              type: "mongodb",
              "name": endPoint.mongoName,
              "url": endPoint.mongoString,
              "useNewUrlParser": true,
              "ssl": true,
              "synchronize": true,
              "logging": false,
              "useUnifiedTopology": true,
              "entities": [
                     "src/entity/**/*.ts"
              ]
       })

       if (connection.isInitialized == true) { console.log(`Successfully connected to database: ${connection.name}`.blue); }
       // const client: MongoClient = new MongoClient(endPoint.mongoString);

       // await client.connect();

       // const db: Db = client.db(endPoint.mongoName);


       // console.log(`Successfully connected to database: ${db.databaseName}`.blue);

}
export default database