import { Parser } from "./models/Parser";

async function main(){
    const parser = await new Parser("mongodb+srv://manav:manavd5@airbnb.0pm27wb.mongodb.net/sample_analytics").connect();    
    parser.query("select * from accounts where limit > n1000 and limit <= N9000", function(result:any){
        console.log(result)
    });
}

main()

