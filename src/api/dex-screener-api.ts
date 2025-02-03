import axios from "axios";
import { TokenProfile } from "../types/dex-screener-latests-tokents.ts";
import { TokenPairProfile } from "../types/dex-screener-pair.ts";

//const RAYDIUM_API_URL = "https://api-v3.raydium.io/pools/info/list";
const DEX_SCREENER_API_URL_LATEST_TOKENS = "https://api.dexscreener.com/token-profiles/latest/v1";

export const getPools = async () => {
  const response = await axios.get(DEX_SCREENER_API_URL_LATEST_TOKENS);
  return await getTokenPairInfo(response.data);
};

async function getTokenPairInfo(data: TokenProfile[]): Promise<TokenPairProfile[]> {
  const pairsArray = await Promise.all(
    data
      .filter((element) => element.chainId === 'solana')  
      .map(async (element) => {
        const response = await axios.get(`https://api.dexscreener.com/token-pairs/v1/${element.chainId}/${element.tokenAddress}`);
        return response.data;  
      })
  );

   
  const flattenedPairs = pairsArray.flat();   


  return flattenedPairs;  
}


