import { Parser } from "./models/Parser";

async function main(){
    const parser = await new Parser("mongodb+srv://manav:manavd5@airbnb.0pm27wb.mongodb.net/sample_restaurants").connect();    
    parser.query("select * from restaurants where borough = Brooklyn and cuisine = American or borough = Brooklyn or cuisine = Hamburgers", function(result:any){
    });
}

main()

