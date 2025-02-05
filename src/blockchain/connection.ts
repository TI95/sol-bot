import {   getAssociatedTokenAddress } from "@solana/spl-token";
import { Liquidity, LiquidityPoolKeys, LiquidityPoolKeysV4, TokenAmount } from "@raydium-io/raydium-sdk";
 import { Connection, Keypair, Transaction, SystemProgram, PublicKey } from "@solana/web3.js";
import axios from "axios";
import { tokenData } from "../types/token";

// Подключение к сети Solana
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

// Кошелек
const wallet = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(process.env.PRIVATE_KEY || "[]"))
);

// ✅ Функция покупки токена
export const buyToken = async (tokenAddress: PublicKey, amount: number) => {
  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: tokenAddress,
        lamports: amount,
      })
    );
    transaction.sign(wallet);
    const signature = await connection.sendRawTransaction(transaction.serialize());
    console.log("✅ Покупка завершена:", signature);
  } catch (error) {
    console.error("❌ Ошибка при покупке:", error);
  }
};



// ✅ Функция продажи токена
export const sellToken = async (tokenAddress: string) => {
    try {
      console.log(`🔴 Продаем токен: ${tokenAddress}`);
  
      // 1️⃣ Получаем пул ликвидности для токена
      const poolInfo = await getLiquidityPool(tokenAddress);
      if (!poolInfo) {
        console.error("❌ Пул ликвидности не найден!");
        return;
      }
  
      // 2️⃣ Получаем адреса токенов (текущего и USDC/SOL)
      const tokenMint = new PublicKey(tokenAddress);
      const baseTokenAccount = await getAssociatedTokenAddress(tokenMint, wallet.publicKey);
      const quoteTokenAccount = await getAssociatedTokenAddress(poolInfo.quoteMint, wallet.publicKey);
  
      // 3️⃣ Создаем swap-транзакцию
      const amountIn = new TokenAmount(poolInfo.baseDecimals, 1_000_000); // 1 токен (пример)
      const { transaction } = await Liquidity.makeSwapInstruction({
        connection,
        poolKeys: poolInfo,
        userKeys: {
          owner: wallet.publicKey,
          tokenAccounts: [
            { pubkey: baseTokenAccount, isSigner: false, isWritable: true },
            { pubkey: quoteTokenAccount, isSigner: false, isWritable: true },
          ],
        },
        amountIn,
        minAmountOut: new TokenAmount(poolInfo.quoteDecimals, 0), // Минимум для защиты
      });
  
      // 4️⃣ Подписываем и отправляем транзакцию
      transaction.sign(wallet);
      const signature = await connection.sendRawTransaction(transaction.serialize());
      console.log(`✅ Продажа отправлена: https://solscan.io/tx/${signature}`);
    } catch (error) {
      console.error("❌ Ошибка при продаже:", error);
    }
  };
  
  // ✅ Функция получения пула ликвидности
  const getLiquidityPool = async (tokenAddress: string): Promise<LiquidityPoolKeys | null> => {
    try {
      const { data } = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
      const pool = data.pairs.find((p: tokenData) => p.pairs.dexId === "Raydium");
      if (!pool) return null;
  
      return {
        id: new PublicKey(pool.pairAddress),
        baseMint: new PublicKey(pool.baseToken.address),
        quoteMint: new PublicKey(pool.quoteToken.address),
        baseDecimals: pool.baseToken.decimals,
        quoteDecimals: pool.quoteToken.decimals,
        lpMint: new PublicKey(pool.lpToken.address),
        lpDecimals: pool.lpToken.decimals,
        version: 4,
        programId: new PublicKey(pool.programId),
        authority: new PublicKey(pool.authority),
        openOrders: new PublicKey(pool.openOrders),
        targetOrders: new PublicKey(pool.targetOrders),
        baseVault: new PublicKey(pool.baseVault),
        quoteVault: new PublicKey(pool.quoteVault),
        withdrawQueue: new PublicKey(pool.withdrawQueue),
        lpVault: new PublicKey(pool.lpVault),
        marketVersion: pool.marketVersion,
        marketProgramId: new PublicKey(pool.marketProgramId),
        marketId: new PublicKey(pool.marketId),
        marketAuthority: new PublicKey(pool.marketAuthority),
        marketBaseVault: new PublicKey(pool.marketBaseVault),
        marketQuoteVault: new PublicKey(pool.marketQuoteVault),
        marketBids: new PublicKey(pool.marketBids),
        marketAsks: new PublicKey(pool.marketAsks),
        marketEventQueue: new PublicKey(pool.marketEventQueue),
        lookupTableAccount: new PublicKey(pool.lookupTableAccount),
      };
    } catch (error) {
      console.error("❌ Ошибка получения пула:", error);
      return null;
    }
  };

// ✅ Функция получения цены токена
export const getTokenPrice = async (tokenAddress: string): Promise<number> => {
  try {
    const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`); //ok
    return response.data.pairs[0]?.priceUsd || 0; // Возвращаем цену
  } catch (error) {
    console.error("❌ Ошибка получения цены:", error);
    return 0;
  }
};
