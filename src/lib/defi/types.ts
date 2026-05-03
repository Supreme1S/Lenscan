export type DefiProtocolCategory =
  | "lending"
  | "dex"
  | "staking"
  | "vault"
  | "perps"
  | "bridge"
  | "other";

export type DefiPositionSide =
  | "deposit"
  | "borrow"
  | "reward"
  | "lp"
  | "staked"
  | "long"
  | "short"
  | "other";

export type DefiPosition = {
  id: string;
  protocolId: string;
  protocolName: string;
  chainId: "sui";
  category: DefiProtocolCategory;
  side: DefiPositionSide;
  title: string;
  assetSymbol: string;
  valueUsd: number;
  details?: Record<string, unknown>;
};

export type DefiProtocolGroup = {
  protocolId: string;
  protocolName: string;
  chainId: "sui";
  category: DefiProtocolCategory;
  valueUsd: number;
  positions: DefiPosition[];
};

export type DefiAdapter = (
  address: string,
  signal?: AbortSignal,
) => Promise<DefiPosition[]>;
