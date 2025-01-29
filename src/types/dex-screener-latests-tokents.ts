export interface ApiResponse {
    schemaVersion: string;
    pairs: Pair[];
  }
  
  export interface Pair {
    chainId: string;
    dexId: string;
    url: string;
    pairAddress: string;
    labels: string[];
    baseToken: Token;
    quoteToken: Token;
    priceNative: string;
    priceUsd: string;
    liquidity: Liquidity;
    fdv: number;
    marketCap: number;
    pairCreatedAt: number;
    info: Info;
    boosts: Boosts;
  }
  
  export interface Token {
    address: string;
    name: string;
    symbol: string;
  }
  
  export interface Liquidity {
    usd: number;
    base: number;
    quote: number;
  }
  
  export interface Info {
    imageUrl: string;
    websites: Website[];
    socials: Social[];
  }
  
  export interface Website {
    url: string;
  }
  
  export interface Social {
    platform: string;
    handle: string;
  }
  
  export interface Boosts {
    active: number;
  }
  

 