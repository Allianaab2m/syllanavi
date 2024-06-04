import craeteCache from "@emotion/cache";

export const defaultCache = createEmotionCache();

export default function createEmotionCache() {
  return craeteCache({ key: "cha" });
}
