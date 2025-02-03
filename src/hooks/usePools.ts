import { useEffect, useState } from "react";
import { getPools } from "../api/dex-screener-api";
import { TokenPairProfile } from "../types/dex-screener-pair.ts";

export const usePools = () => {
  const [pools, setPools] = useState<TokenPairProfile[] | null>(null);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const data = await getPools();
         setPools(data);   
      } catch (error) {
        console.error("Ошибка загрузки пулов:", error);
        setPools(null);  
      }
    };
    
    fetchPools();   
  }, []);   

  return pools;   
};