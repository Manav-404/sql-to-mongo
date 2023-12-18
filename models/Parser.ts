import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { MongoSQLParserLexer } from "../grammar/MongoSQLParserLexer";
import { MongoSQLParserParser } from "../grammar/MongoSQLParserParser";
import { QueryListener } from "./QueryListener";
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker'
import { MongoSQLParserListener } from "../grammar/MongoSQLParserListener";
import { Database } from "./Database";




export class Parser {

    private mongodbInstance: Database | undefined ;
    public constructor(url: string){
        if(!this.mongodbInstance){
            try {
                this.mongodbInstance = Database.getInstance(url);
                return this;
            } catch (error:any) {
                console.log(error.message)
            }
        }
    }

    public async connect(): Promise<Parser>{
        await this.mongodbInstance!.connect();
        return this;
    }

    public async query(statement: string, fn: Function){
        let lexer = new MongoSQLParserLexer(CharStreams.fromString(statement));
        let tokenStream = new CommonTokenStream(lexer);
        let parser = new MongoSQLParserParser(tokenStream);
        parser.addErrorListener(({syntaxError : (recognizer, offendingSymbol, line, charPositionInLine, msg, e) =>{
            throw new Error(`Error in line ${line} at char ${charPositionInLine} : ${msg}`)
        }}))
        let tree = parser.query();
        let parserListener: MongoSQLParserListener = new QueryListener();
        this.mongodbInstance!.query(fn);
        ParseTreeWalker.DEFAULT.walk(parserListener, tree);

    } 
}