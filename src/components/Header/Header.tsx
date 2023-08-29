"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import logo from "@/src/statics/images/logo.png";
import Link from "next/link";
import WalletConnectButton from "../Reusable/WalletConnectButton";
import { useWeb2Context } from "@/src/contexts/web2Context";
import { formatNumberToCurrency } from "@/src/statics/helpers/numberFormatter";
export default function Header() {
  const web2Context = useWeb2Context();

  return (
    <motion.div
      initial={{
        translateY: "-200px",
      }}
      animate={{ translateY: 0 }}
      transition={{ duration: 1, ease: [0.42, 0, 0.58, 1] }}
      className="mx-auto mt-2 md:mt-5 w-full px-4 max-w-[1400px] z-10 flex flex-col md:flex-row justify-center md:justify-between items-center gap-5"
    >
      <Link href="/" className="h-full flex gap-4 items-center text-2xl">
        <Image src={logo} alt="logo" height={60} className="animate-wiggle" />
        SHREKT
      </Link>

      {/* Desktop Menu */}

      <div className="flex justify-end gap-10 items-center">
        <div className="flex gap-4 md:gap-12">
          {/* <Link href="/" className="hover:underline hover:text-green">
            HOME
          </Link>
          <Link href="/ogregator" className="hover:underline hover:text-green">
            BUY
          </Link>
          <Link href="/swamp" className="hover:underline hover:text-green">
            STAKE
          </Link>
         */}
          <a
            href="https://degen.ogrebase.com/"
            className="hover:underline hover:text-green"
          >
            DOCS
          </a>
        </div>
        <div className="flex h-full items-center gap-5">
          {web2Context && (
            <a
              href="https://dexscreener.com/base/0x9c625cb2ae462515fc614528f727d1a4d3bfbde2"
              target="_blank"
              className="hover:text-green flex gap-2 rounded-full h-12 bg-white/10 px-2 justify-between items-center text-xs"
            >
              <div className="relative bg-white h-7 w-7 rounded-full">
                <Image src={logo} alt="logo" className="p-1" fill />
              </div>
              <div>{formatNumberToCurrency(Number(web2Context.ogrePrice))}</div>
            </a>
          )}

          <WalletConnectButton />
        </div>
      </div>
    </motion.div>
  );
}
