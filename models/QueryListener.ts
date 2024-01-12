
import {MongoSQLParserListener}  from '../grammar/MongoSQLParserListener';
import { QueryContext, StatementContext, SourceContext, ColumnContext, Column_listContext, FilterContext, SubsetContext, ConditionContext, ValueContext, Range_conditionContext } from '../grammar/MongoSQLParserParser';
import { event } from '../utils/event';
interface mongoObject {[index:string] : any[] | any}

export class QueryListener implements MongoSQLParserListener {
    private mongoAggregateQuery : any[] = []

    exitQuery(ctx: QueryContext){
        try {
            const populate = this.mongoAggregateQuery.splice(1,1)[0];
            if(Object.keys(populate["$project"]).length>0){
                this.mongoAggregateQuery.push(populate);
            }
            event.emit('exitQuery', this.mongoAggregateQuery);
        } catch (error:any) {
            console.log(error)
        }
    };
    
    enterStatement(ctx: StatementContext){
        console.log(ctx.text)
    };
    enterSource(ctx: SourceContext){
        const collectionName = ctx.IDENTIFIER().text;
        this.mongoAggregateQuery.unshift({collectionName: collectionName});
    };
   
    enterColumn_list(ctx: Column_listContext){
        const populateQuery: mongoObject = {}
        for(let index=0; index< ctx.childCount; index++){
            const child = ctx.getChild(index);
            const avoid = [',', '*']
            if(!avoid.includes(child.text)){
                populateQuery[`${child.text}`] = 1;
            }
        }

        this.mongoAggregateQuery.push({"$project": populateQuery})
    };
    enterCondition(ctx: ConditionContext){
        // If expression - push it in expression stack after translating it into mongo object
        // If operator - a. If stack is empty push it into the stack
        //               b. If stack already contains an operator
        //                  1. If operators are same, continue
        //                  2. If operators are different - make object out of expression and operator stack and push operator in operator stack
        // In end check if an operator remains in the stack if yes, make it parent object and push all expression stack elements to it.

        const operatorStack: any[] = [];
        const expressionStack: any[] = [];
        let aggregateObject : mongoObject = {};
        const expressions :any[] = [];

        for(let index=0; index<ctx.childCount; index++){
            const conditions = ctx.getChild(index);
            const text: string = conditions.text;
            const operatorsToCheck = ["and", "or"];

            if(!operatorsToCheck.includes(text)){
                const column = conditions.getChild(0).text;
                const expression = conditions.getChild(1).text;
                const value = conditions.getChild(2).text;
                const expressionObject: any = this.translateConditionExpression(column, expression, value);
                expressionStack.push(expressionObject);
                continue;
            }

            const top = operatorStack[operatorStack.length-1];

            if(top === text){
                continue;
            }

            if(!top){
                operatorStack.push(text);
                continue;
            }
            
            if(top !== text && expressionStack.length>1){
                bindExpressions();
                if(operatorStack[operatorStack.length-1]!==text){
                    operatorStack.push(text);
                }
                continue;
            }else{
                operatorStack.push(text);
            }
        }

        if(operatorStack.length===0){
            aggregateObject = expressionStack.pop();
        }else if(operatorStack.length === 1){
            const top = operatorStack.pop();
            while(expressionStack.length>0){
                expressions.push(expressionStack.pop())
            }
            aggregateObject[`$${top}`] = expressions;
        }else if(operatorStack.length === 2){
                bindExpressions()
                const top = operatorStack.pop();
                aggregateObject[`$${top}`] = expressions;

        }

        function bindExpressions(){
            const object :mongoObject = {}
                const operator = operatorStack.pop();
                object[`$${operator}`] = [];
                while(expressionStack.length > 0){
                    const top = expressionStack.pop();
                    object[`$${operator}`].push(top);
                }
                expressions.push(object);
        }
        this.mongoAggregateQuery.push({"$match": aggregateObject});

    };

    private translateConditionExpression(column: string, expression:string, value:string){
        
        const columnObject: mongoObject = {};
        columnObject[`${column}`] = {}
        const valueRepresentation = value.split("")[0] === ("N" || "n") ? Number(value.split("").filter((el)=>(el!=="N" && el!=="n")).join(""))  :value;
        console.log(value, valueRepresentation)
        switch(expression){
            case "<":
                columnObject[`${column}`]["$lt"] = valueRepresentation;
                break;
            case ">":
                columnObject[`${column}`]["$gt"] = valueRepresentation;
                break;
            case "=":
                columnObject[`${column}`]["$eq"] = valueRepresentation;
                break;
            case "<=":
                columnObject[`${column}`]["$lte"] = valueRepresentation;
                break;
            case ">=":
                columnObject[`${column}`]["$gte"] = valueRepresentation;
                break;
            default:
                break;
        }

        return columnObject;
    }
}