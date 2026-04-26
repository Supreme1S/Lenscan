export type MockNft = {
  id: string;
  name: string;
  collection: string;
  /** Shown when `imageUrl` is missing or fails to load. */
  imageEmoji?: string;
  imageUrl?: string;
  floorUsd: number | null;
};

export type MockNftCollection = {
  id: string;
  name: string;
  items: MockNft[];
};

export const MOCK_NFT_COLLECTIONS: MockNftCollection[] = [
  {
    id: "sui-frens",
    name: "Sui Frens",
    items: [
      {
        id: "1",
        name: "Fren #1042",
        collection: "Sui Frens",
        imageEmoji: "🐸",
        floorUsd: 45,
      },
      {
        id: "2",
        name: "Fren #0881",
        collection: "Sui Frens",
        imageEmoji: "🦎",
        floorUsd: 45,
      },
    ],
  },
  {
    id: "deepbook",
    name: "DeepBook Traders",
    items: [
      {
        id: "3",
        name: "Trader Pass",
        collection: "DeepBook Traders",
        imageEmoji: "📘",
        floorUsd: 12,
      },
    ],
  },
];
