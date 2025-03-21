import { knex } from "../../database";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { period, start, end } = query;

  let startDate, endDate;
  const now = new Date();

  switch (period) {
    case "day":
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      endDate = now;
      break;
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      endDate = now;
      break;
    case "month":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      endDate = now;
      break;
    case "year":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      endDate = now;
      break;
    case "custom":
      startDate = start
        ? new Date(start)
        : new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      endDate = end ? new Date(end) : now;
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      endDate = now;
  }

  try {
    const prices = await knex("bitcoin_prices")
      .where("timestamp", ">=", startDate)
      .where("timestamp", "<=", endDate)
      .orderBy("timestamp", "asc")
      .select("timestamp", "price_usd", "price_gbp", "price_eur");

    debugger;
    return {
      success: true,
      data: prices,
      period: {
        start: startDate,
        end: endDate,
      },
    };
  } catch (error) {
    console.error("Error retrieving price data:", error.message);
    return {
      success: false,
      error: "Failed to retrieve price data",
    };
  }
});
