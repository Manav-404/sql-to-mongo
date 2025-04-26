import {AbstractParseTreeVisitor} from "antlr4ts/tree/AbstractParseTreeVisitor"
import { AST, ComparisonOperator, LogicalOperator } from "../ast/AST";
import { MongoSQLParserVisitor } from "../../grammar/MongoSQLParserVisitor";
import { ConditionContext, Range_conditionContext } from "../../grammar/MongoSQLParserParser";
import { ComparisonExpression, LogicalExpression } from "../ast/Expression";
import { raw } from "express";

export class QueryVistor extends AbstractParseTreeVisitor<AST> implements MongoSQLParserVisitor<AST> {
    protected defaultResult(): AST {
        throw new Error("Method not implemented.");
    }
    
    visitCondition(ctx: ConditionContext): AST {

        if(ctx.range_condition().length === 1) {
            return this.visit(ctx.range_condition(0));
        }

        const expressions = ctx.range_condition().map((condition)=> this.visit(condition));
        const operators = ctx.logical_operator().map((operator)=> operator.text.toLowerCase() as LogicalOperator);

        return this.buildTree(operators, expressions);

    }

    visitRange_condition(ctx: Range_conditionContext): ComparisonExpression {

        const column = ctx.column().text;

        const comparisonOperator = ctx.comparison_operator().text;

        const opMap: Record<string, ComparisonOperator> = {
            "=": "$eq",
            ">": "$gt",
            "<": "$lt",
            ">=": "$gte",
            "<=": "$lte"
        };

        const operator = opMap[comparisonOperator];
        const rawText = ctx.value().text;
        const value = isNaN(Number(raw)) ? rawText : Number(rawText);


        return {
            type: "ComparisonOperator",
            column,
            operator,
            value

        }



    }

    buildTree(operators: LogicalOperator[], expressions: AST[]): AST{
        if(operators.length === 0 ){
            return expressions[0];
        }

        let current: LogicalExpression= {
            type: "LogicalOperator",
            expressions: [ expressions[0], expressions[1]],
            operator: operators[0]
        }

        for(let index=1; index<operators.length; index++){

            const operator = operators[index];
            const nextExpression = expressions[index+1];

            if(current.operator === operator){
                current.expressions.push(nextExpression);
            }else{
                current = {
                    type: "LogicalOperator",
                    expressions : [current, nextExpression],
                    operator: operator
                }
            }
        }

        return current;
    }

    
}