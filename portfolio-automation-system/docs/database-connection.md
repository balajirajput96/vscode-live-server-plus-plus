# Connect your app to a SQL database

> Learn how to connect to your Replit database from your Replit App.

This guide shows you how to connect to your Replit App's database
from your code using the connection methods:

* **Direct connection**: Connection for development and lighter workloads
* **Connection pooling**: Efficient connection management for high-traffic production applications

To determine which type of connection you need, see
[Choosing your driver and connection type](https://neon.tech/docs/connect/choose-connection#next-choose-your-connection-type-direct-or-pooled)
in the Neon documentation.

> **Tip:** Use **Agent** or **Assistant** to generate code that connects to your existing database.

## Prerequisites

Before getting started, make sure you have the following:

* Created a database in your Replit App
* Knowledge of coding and database connection management

## Create a connection script

> **Note:** This tutorial does not provide examples for all programming languages.
> Use PostgresSQL driver documentation for your project's programming language
> or ask Assistant to translate the code examples.

### Step 1: Create a directory for your connection script

Create a directory at the top level of your project called `scripts`.

### Step 2: Create a connection script

Create a file in this directory and paste one of the following connection examples.

#### Direct connection examples

##### JavaScript

```js
const { Client } = require('pg')

async function queryDatabase() {
  const databaseUrl = process.env.DATABASE_URL
  const client = new Client({ connectionString: databaseUrl })

  try {
    await client.connect()
    const result = await client.query('SELECT * FROM users WHERE active = true')
    return result.rows
  } finally {
    await client.end()
  }
}

queryDatabase()
  .then(rows => console.log(rows))
  .catch(err => console.error(err))
```

##### Python

```py
import os
import psycopg2

database_url = os.environ['DATABASE_URL']

try:
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    # example query that assumes users table is present
    cur.execute("SELECT * FROM users WHERE active = true")
    results = cur.fetchall()
finally:
    cur.close()
    conn.close()
```

#### Pooled connection examples

##### JavaScript

```js
const { Pool } = require('pg')

async function queryDatabasePool() {
  const databaseUrl = process.env.DATABASE_URL
  // changes the URL to use the Neon's connection pooler
  const poolUrl = databaseUrl.replace('.us-east-2', '-pooler.us-east-2')
  const pool = new Pool({
    connectionString: poolUrl,
    max: 10
  })

  try {
    const client = await pool.connect()
    try {
      const result = await client.query('SELECT * FROM users WHERE active = true')
      return result.rows
    } finally {
      client.release()
    }
  } finally {
    await pool.end()
  }
}

queryDatabasePool()
  .then(rows => console.log(rows))
  .catch(err => console.error(err))
```

##### Python

```py
import os
from psycopg2 import pool

database_url = os.environ['DATABASE_URL']
# changes the URL to use the Neon's connection pooler
database_url = database_url.replace('.us-east-2', '-pooler.us-east-2')

connection_pool = pool.SimpleConnectionPool(1, 10, database_url)

try:
    conn = connection_pool.getconn()
    cur = conn.cursor()
    # example query that assumes users table is present
    cur.execute("SELECT * FROM users WHERE active = true")
    results = cur.fetchall()
finally:
    cur.close()
    connection_pool.putconn(conn)
    connection_pool.closeall()
```

## Create a workflow to run your script

> **Info:** Your workflow may vary depending on the language you chose and the file path of the script you created.

### Step 1: Add a new workflow

Navigate to the **Workflows** tool and select **New Workflow** to add a workflow.
In the **Workflow** field, enter "test connection" as the name.

### Step 2: Create a command to run the script

Select **Execute Shell Command** under the **Tasks** heading. Add a command to run the script you created in the line below it.

The following screenshot shows the "test connection" workflow configured to run a JavaScript connection example:

![Database Connection Test Workflow](https://mintlify.s3.us-west-1.amazonaws.com/replit/images/getting-started/database-connection/database-connection-test-workflow.png)

### Step 3: Run the workflow

Select the arrow to the left of the workflow name to run it.

### Step 4: View the output

Navigate to the **Console** tool, where you should see a data from your `users` table, if any exists.

## Next steps

To learn more about working with databases in Replit, see the following resources:

* [Database](/cloud-services/storage-and-databases/sql-database/): learn how to create and manage a SQL database using the Replit Database tool.
* [Workflows](/replit-workspace/workflows/): learn how to create and run custom workflows.

## Use Cases

### E-commerce Applications

![E-commerce Use Case](https://mintlify.s3.us-west-1.amazonaws.com/replit/images/databases/use-case-ecommerce.png)

Database connections are essential for e-commerce applications that need to manage:
- User accounts and authentication
- Product catalogs and inventory
- Order processing and payment tracking
- Customer analytics and reporting

### File Sharing Systems

![File Share Use Case](https://mintlify.s3.us-west-1.amazonaws.com/replit/images/databases/use-case-fileshare.png)

File sharing applications require database connectivity for:
- User permissions and access control
- File metadata and organization
- Sharing logs and audit trails
- Storage optimization and cleanup