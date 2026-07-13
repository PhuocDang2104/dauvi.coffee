import type { CoffeeRegion } from "@/types/common";

export const mockRegions = [
  {
    id: "gia-lai",
    label: "Gia Lai",
    province: "Gia Lai",
    altitudeLabel: "600–800 m",
    dominantSpecies: ["robusta"],
    description: "Vùng cao nguyên bazan gắn với dòng Daily Phin của bộ sưu tập.",
    mapPosition: { x: 42, y: 49 },
  },
  {
    id: "dak-lak",
    label: "Đắk Lắk",
    province: "Đắk Lắk",
    altitudeLabel: "500–800 m",
    dominantSpecies: ["robusta"],
    description: "Điểm dừng của TR4 và TR9 trong hành trình vị giác Robusta.",
    mapPosition: { x: 45, y: 57 },
  },
  {
    id: "bao-lam",
    label: "Bảo Lâm",
    province: "Lâm Đồng",
    altitudeLabel: "800–1.000 m",
    dominantSpecies: ["robusta"],
    description: "Vùng được dùng để kể câu chuyện giống Xanh Lùn TS5 trong bản demo.",
    mapPosition: { x: 49, y: 66 },
  },
  {
    id: "da-lat",
    label: "Đà Lạt / Cầu Đất",
    province: "Lâm Đồng",
    altitudeLabel: "1.400–1.600 m",
    dominantSpecies: ["arabica"],
    description: "Vùng cao mát hơn, đại diện bằng Catimor Washed cân bằng.",
    mapPosition: { x: 55, y: 64 },
  },
  {
    id: "langbiang",
    label: "Langbiang",
    province: "Lâm Đồng",
    altitudeLabel: "1.500–1.700 m",
    dominantSpecies: ["arabica"],
    description: "Điểm cuối thanh sáng của collection với Bourbon Honey.",
    mapPosition: { x: 53, y: 62 },
  },
] satisfies CoffeeRegion[];

