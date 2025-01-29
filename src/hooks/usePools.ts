import { useEffect, useState } from "react";
import { getPools } from "../api/dex-screener-api";
import { ApiResponse } from "../types/dex-screener-latests-tokents";

export const usePools = () => {
  
  const [pools, setPools] = useState<ApiResponse | null>(null);

  useEffect(() => {
    const fetchPools = async () => {
      const data = await getPools();
      setPools(data);
    };
    fetchPools();
  }, []);

  return pools;
};