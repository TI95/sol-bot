import React from "react";
import { ApiResponse } from "../types/dex-screener-latests-tokents";




const CoinsList: React.FC<{ pools: ApiResponse | null }> = ({ pools }) => {
    console.log(pools)

    if (pools) {

        return (
            <div >
                {pools.pairs.map((pool) => (
                    pool.chainId === 'solana' ?
                        <div>
                        
                            <a href={pool.url} target="_blank">Link</a>
                            <p>{pool.baseToken.address}</p>
                        </div> :
                        null
                ))}
            </div>
        );
    }

};

export default CoinsList;