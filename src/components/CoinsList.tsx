// components/CoinsList.tsx
import React from "react";
import { TokenPairProfile } from "../types/dex-screener-pair"; 
import { usePools } from "../hooks/usePools"; 

const CoinsList: React.FC = () => {
  const pools = usePools(); 

  if (!pools) {
    return <div>Loading or no pools available...</div>;
  }

  const formatDateTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  const getTimeDifference = (timestamp: number): string => {
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000); 
  
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
  
    if (days > 0) return `${days} д. назад`;
    if (hours > 0) return `${hours} ч. назад`;
    if (minutes > 0) return `${minutes} м. назад`;
    return `${seconds} с. назад`;
  };

  return (
    <div className="">
      {pools.map((pool: TokenPairProfile) => (
        pool.chainId === 'solana' && pool.dexId === 'raydium' && pool.liquidity.usd >= 25000 ? (
          <div key={pool.pairAddress}>
            <a href={pool.url} target="_blank" rel="noopener noreferrer">
              Link
            </a>
            <p>Token Name: {pool.baseToken.name}</p>
            <p className="font-semibold  text-amber-400">Token CA: {pool.baseToken.address}</p>
            <p> Создано в: {formatDateTime(pool.pairCreatedAt)}</p>
            <p className="mb-5"> Прошло время с момента создания: {getTimeDifference(pool.pairCreatedAt)}</p>
          </div>
        ) : null
      ))}
    </div>
  );
};

export default CoinsList;


