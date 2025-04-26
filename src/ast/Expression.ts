import { AST, ComparisonOperator, LogicalOperator } from "./AST"

export interface LogicalExpression extends AST {
    type: "LogicalOperator";
    operator: LogicalOperator;
    expressions: AST[];
}

export interface ComparisonExpression extends AST {
    type: "ComparisonOperator";
    operator: ComparisonOperator;
    column: string;
    value: string | number;
}