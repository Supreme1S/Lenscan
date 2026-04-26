"use server";

import { revalidatePath } from "next/cache";
import { addFavorite, removeFavorite } from "@/lib/data/favorites";
import { isValidSuiAddress, normalizeSuiAddress } from "@/lib/sui-address";

export async function createFavorite(formData: FormData): Promise<void> {
  const raw = (formData.get("walletAddress") as string)?.trim() ?? "";
  const walletAddress = normalizeSuiAddress(raw);
  const labelRaw = formData.get("label") as string | null;
  const label = labelRaw?.trim() ? labelRaw.trim() : undefined;

  if (!walletAddress) {
    throw new Error("walletAddress is required");
  }
  if (!isValidSuiAddress(walletAddress)) {
    throw new Error("Invalid Sui address (0x + 64 hex characters).");
  }

  await addFavorite(walletAddress, label);
  revalidatePath("/favorites");
  revalidatePath("/portfolio");
}

export async function deleteFavoriteForm(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  if (!id?.trim()) {
    throw new Error("Favorite id is required");
  }
  await removeFavorite(id.trim());
  revalidatePath("/favorites");
}
