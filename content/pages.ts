import type { SeoPageDefinition } from "@/config/types";
import rawPages from "./site-data/pages.json";

export const corePages = rawPages as SeoPageDefinition[];
