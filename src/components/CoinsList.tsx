import React from "react";
import { usePools } from "../hooks/usePools";  // Подключаем хук

const CoinsList: React.FC = () => {
  const pools = usePools();   

   if (!pools) {
    return <div>Loading or no pools available...</div>;
  }

  return (
    <div className="">
      {pools.map((pool) => (
        pool.chainId === 'solana' && pool.dexId === 'raydium' && pool.liquidity.usd >= 40000 ? (
          <div key={pool.pairAddress}>
            <a href={pool.url} target="_blank" rel="noopener noreferrer">
              Link
            </a>
            <p>{pool.baseToken.name}</p>
            <p>{pool.baseToken.address}</p>
          </div>
        ) : null
      ))}
    </div>
  );
};

export default CoinsList;

