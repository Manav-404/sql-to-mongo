export type LogicalOperator = "and" | "or";
export type ComparisonOperator = "$eq" | "$ne" | "$gt" | "$gte" | "$lt" | "$lte";

export interface AST{
    type: "LogicalOperator" | "ComparisonOperator";
}
