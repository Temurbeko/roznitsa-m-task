import { createKnex } from "./knex";

const knex = createKnex();

async function initializeDatabase() {
  const exists = await knex.schema.hasTable("bitcoin_prices");

  if (!exists) {
    await knex.schema.createTable("bitcoin_prices", (table) => {
      table.increments("id").primary();
      table.timestamp("timestamp").notNullable().unique();
      table.float("price_usd").notNullable();
      table.float("price_gbp").notNullable();
      table.float("price_eur").notNullable();
      table.index("timestamp");
    });
    console.log("Bitcoin prices table created");
  }
}

export { knex, initializeDatabase };
