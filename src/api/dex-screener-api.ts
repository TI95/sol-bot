import axios from "axios";


//const RAYDIUM_API_URL = "https://api-v3.raydium.io/pools/info/list";
const DEX_SCREENER_API_URL_LATEST_TOKENS = "https://api.dexscreener.com/latest/dex/search/q=";

export const getPools = async () => {
    const response = await axios.get(DEX_SCREENER_API_URL_LATEST_TOKENS);
    console.log(response)
    return response.data;
  };