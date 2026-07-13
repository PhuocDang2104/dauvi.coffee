export interface CoffeeRegion {
  id: "gia-lai" | "dak-lak" | "bao-lam" | "da-lat" | "langbiang";
  label: string;
  province: string;
  position: { x: number; y: number };
  dominantSpecies: "Robusta" | "Arabica";
  altitudeLabel: string;
  description: string;
  productSlugs: string[];
}

export const COFFEE_REGIONS: CoffeeRegion[] = [
  {
    id: "gia-lai",
    label: "Gia Lai",
    province: "Gia Lai",
    position: { x: 39, y: 53 },
    dominantSpecies: "Robusta",
    altitudeLabel: "Cao nguyên bazan",
    description: "Điểm mở đầu của dòng Daily Phin trong hành trình bộ sưu tập.",
    productSlugs: ["trs1-tay-nguyen-daily-phin"],
  },
  {
    id: "dak-lak",
    label: "Đắk Lắk",
    province: "Đắk Lắk",
    position: { x: 42, y: 61 },
    dominantSpecies: "Robusta",
    altitudeLabel: "500–800 m · nhãn minh họa",
    description:
      "Robusta đậm và Fine Robusta tạo nên nhiều lớp vị cho pha phin.",
    productSlugs: [
      "tr4-dak-lak-traceable-robusta",
      "tr9-large-bean-fine-robusta",
    ],
  },
  {
    id: "bao-lam",
    label: "Bảo Lâm",
    province: "Lâm Đồng",
    position: { x: 45, y: 68 },
    dominantSpecies: "Robusta",
    altitudeLabel: "Cao nguyên Lâm Đồng",
    description:
      "Nơi câu chuyện giống Xanh Lùn TS5 gặp phương pháp sơ chế Honey.",
    productSlugs: ["xanh-lun-ts5-bao-lam-honey"],
  },
  {
    id: "da-lat",
    label: "Đà Lạt / Cầu Đất",
    province: "Lâm Đồng",
    position: { x: 49, y: 66 },
    dominantSpecies: "Arabica",
    altitudeLabel: "Vùng cao mát",
    description:
      "Catimor cân bằng, hương cam và trà đen cho pour-over hoặc drip.",
    productSlugs: ["catimor-da-lat-washed"],
  },
  {
    id: "langbiang",
    label: "Langbiang",
    province: "Lâm Đồng",
    position: { x: 51, y: 64 },
    dominantSpecies: "Arabica",
    altitudeLabel: "Sườn núi cao",
    description: "Điểm đến thanh và giàu hương của Bourbon sơ chế Honey.",
    productSlugs: ["bourbon-langbiang-honey"],
  },
];

export const REGION_DATA_NOTE =
  "Mô tả vùng mang tính định hướng bộ sưu tập; độ cao cụ thể được trình bày theo từng hồ sơ lô và mức bằng chứng tương ứng.";
