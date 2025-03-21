import Knex from "knex";
import path from "path";

export function createKnex() {
  return Knex({
    client: "better-sqlite3",
    connection: {
      filename: path.resolve("./bitcoin_prices.sqlite"),
    },
    useNullAsDefault: true,
  });
}
