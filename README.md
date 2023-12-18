
# SQL queries on top of MongoDB
It is a programmatic tool that helps you write SELECT queries on top of MongoDB collections.





## How to run the project

#### 1. Install all dependencies

```
  npm install
```

#### 2. Building SQL Grammar

```
  npm run sql-mongo
```

#### 3. Formulating the query [API Docs](#api-reference)

#### 4. Running the application to query

```
npm run query
```



## API Reference

#### 1. Import the parser

```typescript
import { Parser } from "./models/Parser";
```

#### 2. Create a new parser object

```typescript
  const parser = new Parser(url)
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `url` | `string` | **Required**. Connection URL of MongoDB database |
> **_NOTE:_**  The connection url must contain database name

#### For example
```
mongodb+srv://url/sample_database
```


#### 3. Call the connect method to connect to the MongoDB instance

```typescript
await parser.connect();
```

#### 4. Use the query method to query from the collection

```typescript
 parser.query(statement, callback);
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `statement` | `string` | **Required**. SQL select statement |
| `callback` | `function` | **Required**. Callback function to get the results |

## Query Semantics

```SQL
SELECT [ * | column name(s) ]
FROM [ collection name ]
[WHERE condition]
```

### Column
At least one of them is required
| Parameter | Description                       |
| :-------- | :-------------------------------- |
| `*` | Select all columns |
| `column1, column2...` | Select one or more specific columns |

### Collection Name
At least one collection name is required
| Parameter | Description                       |
| :-------- | :-------------------------------- |
| `users` | Name of the collection to perform query |

### Condition in where clause 

| Parameter | Description                       |
| :-------- | :-------------------------------- |
| `column1=SQL and column2>=100 or column3 < 200...` | Conditions with logical and range operators to satisfy for selecting documents |

### Operators
Supported logical and range operators

| Parameter | Type  |                         
| :-------- | :------- |
| `AND` | `Logical` |
| `OR` | `Logical` |
| `<` | `Range` |
| `>` | `Range` |
| `=` | `Range` |
| `<=` | `Range` |
| `>=` | `Range` |



