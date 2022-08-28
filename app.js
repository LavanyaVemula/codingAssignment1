const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");
let db = null;
app.use(express.json());

const initializeDbAndStartServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Starts at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndStartServer();

const hasStatusQuery = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const hasPriorityQuery = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusAndPriorityQuery = (requestQuery) => {
  return (
    requestQuery.status !== undefined && requestQuery.priority !== undefined
  );
};
const hasCategoryAndStatusQuery = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  );
};
const hasCategoryQuery = (requestQuery) => {
  return;
  requestQuery.category !== undefined;
};
const hasCategoryAndPriorityQuery = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  );
};

app.get("/todos/", async (request, response) => {
  let data = null;
  let getTodosQuery = "";
  const { search_q = "", status, priority, category } = request.query;

  switch (true) {
    case hasStatusQuery(request.query):
      console.log({ status });

      getTodosQuery = `
            SELECT *
            FROM todo
            WHERE status = '${status}'
          `;
      break;
    case hasPriorityQuery(request.query):
      getTodosQuery = `
            SELECT *
            FROM todo
            WHERE priority = '${priority}'
        `;
      break;
    case hasStatusAndPriorityQuery(request.query):
      getTodosQuery = `
            SELECT *
            FROM todo
            WHERE status = '${status}'
            AND priority = '${priority}'
        `;
      break;
    case hasCategoryAndStatusQuery(request.query):
      getTodosQuery = `
            SELECT *
            FROM todo
            WHERE category = '${category}'
            AND status = '${status}'
        `;
      break;
    case hasCategoryQuery(request.query):
      getTodosQuery = `
            SELECT *
            FROM todo
            WHERE category = '${category}'
        `;
      break;
    case hasCategoryAndPriorityQuery(request.query):
      getTodosQuery = `
            SELECT *
            FROM todo
            WHERE category = '${category}'
            AND priority = '${priority}'
        `;
    default:
      getTodosQuery = `
            SELECT *
            FROM todo
            WHERE todo LIKE '%${search_q}%'
        `;
      break;
  }
  data = await db.all(getTodosQuery);
  response.send(data);
});

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoQuery = `
    SELECT *
    FROM todo
    WHERE id = ${todoId}
    `;
  data = await db.get(getTodoQuery);
  response.send(data);
});
module.exports = app;
