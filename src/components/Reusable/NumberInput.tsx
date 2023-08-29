import { formatNumberToCurrency } from "@/src/statics/helpers/numberFormatter";

export default function NumberInput({
  type,
  tokenImg,
  tokenSymbol,
  value,
  unitPrice,
  balance,
  setValueCallback,
  onAssetClickCallback,
}: {
  type?: string;
  tokenImg: any;
  tokenSymbol: string;
  value: string;
  unitPrice?: Number;
  balance?: string;
  setValueCallback?: (value: string) => void;
  onAssetClickCallback?: (value: string) => void;
}) {
  return (
    <div className="mt-2 w-full flex items-center h-10 gap-2 bg-[#3c3c35] rounded-md relative">
      <button
        onClick={() =>
          type && onAssetClickCallback ? onAssetClickCallback(type) : null
        }
        className="relative min-w-[60px] flex items-center justify-center h-full hover:bg-ogre/10 border-r-[1px] border-dark"
      >
        <img
          alt={tokenSymbol}
          className="h-[25px] aspect-square rounded-full"
          src={tokenImg}
          onError={(e: any) => {
            e.target.onerror = null;
            e.target.src = "/tokens/unknown.png";
          }}
        />
      </button>

      <input
        disabled={!balance}
        value={value}
        onChange={(e) =>
          setValueCallback ? setValueCallback(e.target.value) : null
        }
        type="number"
        placeholder={balance ? `Enter ${tokenSymbol} amount` : "0"}
        className="pl-2 w-full outline-none bg-transparent"
      />
      {unitPrice != null && (
        <div>{formatNumberToCurrency(Number(value) * Number(unitPrice))}</div>
      )}

      {balance && (
        <button
          onClick={() => {
            setValueCallback ? setValueCallback(balance ? balance : "") : null;
          }}
          className="min-w-[60px] flex gap-2 hover:bg-ogre/10 border-l-[1px] border-dark justify-center items-center relative whitespace-nowrap px-4 h-full transition-colors duration-500"
        >
          MAX
        </button>
      )}
    </div>
  );
}
