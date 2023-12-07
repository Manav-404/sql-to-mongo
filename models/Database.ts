import { Db, MongoClient } from "mongodb";
import { event } from "../utils/event";

export class Database {

    private connection!: MongoClient;
    private connectionURL : string;
    private db! : Db;
    private static database: Database;

    private constructor(connectionURL: string){
        this.connectionURL = connectionURL;
    }

    public static getInstance(url: string): Database{
        if(!url) throw new Error("Database Error: Please provide a valid mongodb url")
        if(this.database){
            return this.database;
        }
        return new Database(url);
    }

    public async connect (){
        try {
            const url = this.connectionURL.split("/");
            const databaseName = url.pop();
            const client = new MongoClient(this.connectionURL);
            const connection = await client.connect();
            console.log('Connected with Mongodb on URI:', this.connectionURL);
            this.connection = connection;
            let db = this.connection.db(databaseName);
            this.db = db;
        } catch (error: any) {
            throw new Error(error);
        }
    } 

    public query(fn: Function){
            event.on('exitQuery' , async (mongoAggregateQuery)=>{
                const collection = mongoAggregateQuery.shift()["collectionName"]!;
                let results  = await this.db.collection(collection).aggregate(mongoAggregateQuery).toArray()
                fn(results);
            })
    }
}