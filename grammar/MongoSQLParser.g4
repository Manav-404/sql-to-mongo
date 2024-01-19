grammar MongoSQLParser ;

/*

* Parser Rules

*/
query: 
    statement    
    ;
statement: 
    subset 
    source 
    filter 
    ; 
subset: 
    SELECT 
    column_list 
    ;
column_list: 
    '*'
    |
    column 
    (',' column)* 
    ;
column: 
    IDENTIFIER  | IDENTIFIER ('.' IDENTIFIER)*
    ;
source: 
    FROM 
    IDENTIFIER 
    ;
filter: 
    WHERE 
    condition 
    ;
condition:
    range_condition (logical_operator range_condition)*
    |
    range_condition
    ;
range_condition:
    column 
    comparison_operator 
    value 
    ;
value:
    NUMBER | IDENTIFIER ;
logical_operator: 
    AND | OR ;
comparison_operator:
    EQ | GT | LT | LTE | GTE ;

/*

* Lexer Rules

*/


NUMBER: [Nn] DIGIT+ ([.,] DIGIT+)? ;

SELECT : S E L E C T ;

FROM : F R O M ;

WHERE: W H E R E ;

AND : A N D ;

OR: O R ;

GTE: '>=' ;

GT: '>' ;

LTE: '<=' ;

LT: '<' ;

EQ: '=' ;

IDENTIFIER: WORD ;

WS: [ \t\r\n]+ -> skip;

fragment WORD: [a-zA-Z_][a-zA-Z0-9_]*;
fragment DIGIT: [0-9] ;

fragment A:('a'|'A');
fragment B:('b'|'B');
fragment C:('c'|'C');
fragment D:('d'|'D');
fragment E:('e'|'E');
fragment F:('f'|'F');
fragment G:('g'|'G');
fragment H:('h'|'H');
fragment I:('i'|'I');
fragment J:('j'|'J');
fragment K:('k'|'K');
fragment L:('l'|'L');
fragment M:('m'|'M');
fragment N:('n'|'N');
fragment O:('o'|'O');
fragment P:('p'|'P');
fragment Q:('q'|'Q');
fragment R:('r'|'R');
fragment S:('s'|'S');
fragment T:('t'|'T');
fragment U:('u'|'U');
fragment V:('v'|'V');
fragment W:('w'|'W');
fragment X:('x'|'X');
fragment Y:('y'|'Y');
fragment Z:('z'|'Z');






