import type { FavoriteWallet } from "@/lib/types/portfolio";

export const mockFavorites: FavoriteWallet[] = [
  {
    id: "f1",
    walletAddress: "0x1a2b…9f0e",
    label: "Cold vault",
  },
  {
    id: "f2",
    walletAddress: "0x7c8d…3a11",
    label: null,
  },
];
