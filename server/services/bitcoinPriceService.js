import axios from "axios";
import { knex } from "../database";
import cron from "node-cron";

async function fetchBitcoinPrice() {
  try {
    const response = await axios.get(
      "https://api.coindesk.com/v1/bpi/currentprice.json"
    );
    const data = response.data;

    const timestamp = new Date(data.time.updatedISO);
    const priceUSD = parseFloat(data.bpi.USD.rate_float);
    const priceGBP = parseFloat(data.bpi.GBP.rate_float);
    const priceEUR = parseFloat(data.bpi.EUR.rate_float);

    await savePriceData(timestamp, priceUSD, priceGBP, priceEUR);

    console.log(`Bitcoin price data saved: $${priceUSD} at ${timestamp}`);
    return { timestamp, priceUSD, priceGBP, priceEUR };
  } catch (error) {
    console.error("Error fetching Bitcoin price:", error.message);
    throw error;
  }
}

async function savePriceData(timestamp, priceUSD, priceGBP, priceEUR) {
  try {
    const existing = await knex("bitcoin_prices")
      .where("timestamp", timestamp)
      .first();

    if (!existing) {
      await knex("bitcoin_prices").insert({
        timestamp,
        price_usd: priceUSD,
        price_gbp: priceGBP,
        price_eur: priceEUR,
      });
    }
  } catch (error) {
    console.error("Error saving price data:", error.message);
    throw error;
  }
}

function startDataCollection() {
  fetchBitcoinPrice();

  cron.schedule("*/10 * * * *", () => {
    fetchBitcoinPrice();
  });
}

export { fetchBitcoinPrice, startDataCollection };
