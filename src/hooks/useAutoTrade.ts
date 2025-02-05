import { useEffect, useState } from "react";
import { usePools } from "./usePools";
import { buyToken, sellToken, getTokenPrice } from "../blockchain/connection";
import { PublicKey } from "@solana/web3.js";

// Храним цены покупки
const purchasedTokens: Record<string, number> = {}; // { "адрес токена": цена покупки }

export const useAutoTrade = () => {
  const pools = usePools();
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!pools) return;

    pools.forEach(async (pool) => {
      const tokenAddress = pool.baseToken.address;
      const publicKey = new PublicKey(tokenAddress);

      // ✅ Покупаем токен, если он не куплен
      if (!purchasedTokens[tokenAddress]) {
        const price = await getTokenPrice(tokenAddress);
        purchasedTokens[tokenAddress] = price; // Запоминаем цену покупки
        console.log(`✅ Купили ${tokenAddress} по цене ${price}`);
        buyToken(publicKey, 10000000);
      }
    });
  }, [pools]);

  // 📌 Отслеживаем цену и продаем при +50%
  useEffect(() => {
    const interval = setInterval(async () => {
      for (const tokenAddress of Object.keys(purchasedTokens)) {
        const currentPrice = await getTokenPrice(tokenAddress);
        setPrices((prev) => ({ ...prev, [tokenAddress]: currentPrice }));

        const buyPrice = purchasedTokens[tokenAddress];

        if (currentPrice >= buyPrice * 1.5) {
          console.log(`📈 Продаем ${tokenAddress} за ${currentPrice}`);
          sellToken(tokenAddress); // Вызываем продажу
          delete purchasedTokens[tokenAddress]; // Удаляем из списка
        }
      }
    }, 10000); // Проверяем раз в 10 сек

    return () => clearInterval(interval);
  }, []);

  return prices; // Можно использовать в UI
};
