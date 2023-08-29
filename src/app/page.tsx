"use client";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import shrek2 from "@/src/statics/images/shrek2.png";

import NumberInput from "@/src/components/Reusable/NumberInput";
import {
  Address,
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "viem";
import OGRE from "@/src/statics/images/logo.png";
import useTokenBalance from "@/src/hooks/useTokenBalance";
import useAllowance from "@/src/hooks/useAllowance";
import useApprove from "@/src/hooks/useApprove";
import {
  NULL_ADDRESS,
  OGRE_ADDRESS,
  WETH_ADDRESS,
} from "@/src/statics/addresses";
import { Token, tokens } from "@/src/statics/tokens";
import { formatNumberToCurrency } from "@/src/statics/helpers/numberFormatter";
import SelectTokenModal from "@/src/components/Reusable/SelectTokenModal";

export default function Ogregator() {
  const [value, setValue] = useState("");
  const [slippage, setSlippage] = useState("2"); // 2%
  const [modalType, setModalType] = useState<string | null>(null);
  const [error, setError] = useState(null);
  const [quote, setQuote] = useState<any>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [tokenIn, setTokenIn] = useState<Token>(
    tokens.find((t) => t.address === NULL_ADDRESS) as Token
  );
  const [tokenOut, setTokenOut] = useState<Token>(
    tokens.find((t) => t.address === OGRE_ADDRESS) as Token
  );

  const amountIn = useMemo(
    () => parseUnits(value as `${number}`, tokenIn.decimals),
    [value]
  );

  const tokenInBalance = useTokenBalance(
    tokenIn!.address != NULL_ADDRESS ? tokenIn.address : undefined
  );

  const tokenInAllowance = useAllowance(
    tokenIn.address as Address,
    quote?.allowanceTarget
  );
  const approveTX = useApprove(
    amountIn,
    tokenIn.address as Address,
    quote?.allowanceTarget
  );

  console.log("allowance", tokenInAllowance);

  // const swapTX = useSwap0x(
  //   quote && {
  //     to: quote.to,
  //     data: quote.data,
  //     value: quote.value,
  //   }
  // );

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (amountIn > 0) {
        setQuoteLoading(true);
        // const quote = await quoteSwap0x(amountIn, tokenIn, tokenOut, slippage);
        console.log("quote", JSON.stringify(quote, null, 2));
        if (quote && quote.validationErrors != null) {
          setError(quote);
          setQuote(null);
        } else {
          setQuote(quote);
        }
        setQuoteLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [amountIn, tokenIn, tokenOut]);

  function tokenClicked(type: string) {
    setModalType(type);
  }

  function tokenSelected(token: Token) {
    if (modalType === "tokenIn") {
      if (token.address === tokenOut.address) {
        setTokenOut(tokenIn);
        setTokenIn(token);
      } else {
        setTokenIn(token);
      }
    } else {
      if (token.address === tokenIn.address) {
        setTokenIn(tokenOut);
        setTokenOut(token);
      } else {
        setTokenOut(token);
      }
    }
    setModalType(null);
  }

  return (
    <>
      <section className="relative w-full flex items-center">
        {modalType && (
          <SelectTokenModal
            onClose={() => {
              setModalType(null);
            }}
            onSelect={tokenSelected}
          />
        )}
        <motion.div
          initial={{ scale: 1.05, opacity: 0, translateY: "-20px" }}
          animate={{ scale: 1, opacity: 1, translateY: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full flex items-center justify-center"
        >
          
          <div className="flex flex-col gap-5 w-full max-w-3xl">
            <div className="text-2xl">
              <div>
                You can <span className="text-green">buy tokens</span> at the
                best price here!
              </div>
            </div>

            <div className="border-green rounded-md border-[1px] font-sans bg-dark p-6">
              <div className="flex w-full justify-between">
                <div className="flex gap-6 font-bold text-2xl">
                  Swap {tokenIn.symbol} to {tokenOut.symbol}
                </div>
                {quoteLoading && (
                  <Image
                    height={25}
                    src={OGRE}
                    alt="loading"
                    className="animate-spin "
                  />
                )}
              </div>

              <div className="mt-6">
                <div className="flex gap-1">
                  <div>In Wallet:</div>
                  <div className="font-bold">
                    {tokenInBalance?.formatted} {tokenInBalance?.symbol}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <NumberInput
                    type="tokenIn"
                    tokenImg={tokenIn.logoURI}
                    tokenSymbol={tokenIn!.symbol}
                    balance={tokenInBalance ? tokenInBalance.formatted : "0"}
                    value={value}
                    setValueCallback={setValue}
                    onAssetClickCallback={tokenClicked}
                  />

                  <NumberInput
                    type="tokenOut"
                    tokenImg={tokenOut.logoURI}
                    tokenSymbol={tokenOut!.symbol}
                    value={
                      quote && quote.buyAmount
                        ? Number(
                            formatUnits(quote.buyAmount, tokenOut.decimals)
                          ).toFixed(4)
                        : ""
                    }
                    onAssetClickCallback={tokenClicked}
                  />
                </div>

                {quote != null && (
                  <div className="mt-6 w-full z-10">
                    <div className="text-2xl">Your Quote</div>
                    <div className="w-full flex gap-6 mt-3">
                      <div className="flex flex-col">
                        You trade
                        <div className="flex gap-2 items-center">
                          <div className="font-bold">
                            {Number(value).toFixed(4)} {tokenIn.symbol}
                            {
                              <span>
                                {" "}
                                (
                                {formatNumberToCurrency(
                                  quote.tokenPrice[
                                    tokenIn.symbol === "ETH" ||
                                    tokenIn.symbol === "wETH"
                                      ? WETH_ADDRESS
                                      : tokenIn.address.toLocaleLowerCase()
                                  ] * Number(value)
                                )}
                                )
                              </span>
                            }
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        to get
                        <div className="flex gap-2 items-center">
                          <div className="font-bold">
                            {Number(
                              formatUnits(quote.buyAmount, tokenOut.decimals)
                            ).toFixed(4)}{" "}
                            {tokenOut.symbol}
                            {
                              <span>
                                {" "}
                                (
                                {formatNumberToCurrency(
                                  quote.tokenPrice[
                                    tokenOut.symbol === "ETH" ||
                                    tokenOut.symbol === "wETH"
                                      ? WETH_ADDRESS
                                      : tokenOut.address.toLocaleLowerCase()
                                  ] *
                                    Number(
                                      formatUnits(
                                        quote.buyAmount,
                                        tokenOut.decimals
                                      )
                                    )
                                )}
                                )
                              </span>
                            }
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        Price Impact
                        <div className="flex gap-2 items-center">
                          <div className="font-bold">
                            {Number(quote.estimatedPriceImpact).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        Slippage (%)
                        <div className="flex gap-2 items-center">
                          <input
                            value={slippage}
                            onChange={(e) => setSlippage(e.target.value)}
                            type="number"
                            className="w-12 gap-2 bg-[#3c3c35] rounded-md pl-2 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 w-full flex justify-between gap-6 font-bold">
                  {quote &&
                    quote.allowanceTarget != NULL_ADDRESS &&
                    amountIn > 0 &&
                    tokenInAllowance < amountIn && (
                      <button
                        disabled={!approveTX.transaction.write || !value}
                        onClick={() => {
                          if (approveTX.transaction.write) {
                            approveTX.transaction.write();
                          }
                        }}
                        className={`disabled:contrast-50 bg-green rounded-md w-full gap-2 transition-transform relative flex justify-center items-center px-4 h-12 text-black`}
                      >
                        {approveTX.transaction.isLoading
                          ? "APPROVING"
                          : "APPROVE"}
                      </button>
                    )}

                  <button
                    // disabled={!quote || !value || !swapTX.sendTransaction}
                    onClick={() => {
                      // if (swapTX.sendTransaction) {
                      //   swapTX.sendTransaction();
                      // }
                    }}
                    className={`disabled:contrast-50 bg-green rounded-md w-full gap-2 transition-transform relative flex justify-center items-center px-4 h-12 text-black`}
                  >
                    UNCOMMENT THIS SWAP BUTTON
                    {/* {swapTX.isLoading ? "SWAPPING" : "SWAP"} */}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
