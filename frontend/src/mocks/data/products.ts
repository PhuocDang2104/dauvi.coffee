import { productArraySchema } from "@/features/products/domain/product.schema";

import { createProduct, createStandardVariants } from "../factories/product.factory";

export const DEMO_LOT_CODES = {
  trs1: "TRS1-GL-26-N01",
  tr4: "TR4-DLK-26-N02",
  tr9: "TR9-DLK-26-H01",
  xanhLun: "XLTS5-BL-26-H01",
  catimor: "CAT-DL-26-W01",
  bourbon: "BBN-LB-26-H01",
} as const;

const tr4 = createProduct({
  id: "tr4",
  slug: "tr4-dak-lak-traceable-robusta",
  displayName: "TR4 Đắk Lắk Traceable Robusta",
  shortName: "TR4 Đắk Lắk",
  proposition: "Dòng Robusta chủ lực với body dày, hậu vị đậm và hồ sơ lô nổi bật.",
  species: "robusta",
  scientificName: "Coffea canephora",
  variety: "TR4",
  segment: "Traceable standard",
  role: "signature",
  regionId: "dak-lak",
  regionLabel: "Buôn Ma Thuột, Đắk Lắk",
  altitudeLabel: "500–800 m",
  process: "natural",
  roastLevel: "medium-dark",
  flavor: {
    bitterness: 4,
    acidity: 1,
    sweetness: 3,
    body: 5,
    aroma: 3,
    notes: ["Cacao", "Hạnh nhân", "Caramel"],
    caffeine: "high",
  },
  brewMethods: ["phin", "espresso", "cold-brew"],
  story:
    "TR4 đại diện cho một tách Robusta Tây Nguyên rõ nét: body dày, vị đậm và phù hợp với nhịp pha phin hằng ngày.",
  varietyFacts: [
    "Thông tin về giống được trình bày ở mức Reference Data và không thay thế hồ sơ xác minh của từng lô.",
  ],
  badges: ["Vietnam Traceable", "Signature Robusta"],
  accent: "#214536",
  pattern: "angular-route",
  image: {
    src: "/images/products/tr4-dak-lak-pack.webp",
    alt: "Gói cà phê DẤU VỊ TR4 màu xanh rừng với đường tuyến địa hình",
  },
  variants: createStandardVariants({
    skuPrefix: "TR4",
    price250: 119_000,
    price500: 219_000,
  }),
  featuredLotCode: DEMO_LOT_CODES.tr4,
  published: true,
});

const catimor = createProduct({
  id: "catimor",
  slug: "catimor-da-lat-washed",
  displayName: "Catimor Đà Lạt Washed",
  shortName: "Catimor Đà Lạt",
  proposition: "Arabica cân bằng, dễ tiếp cận với hương cam, caramel và trà đen.",
  species: "arabica",
  scientificName: "Coffea arabica",
  variety: "Catimor",
  segment: "Standard Arabica",
  role: "gateway-arabica",
  regionId: "da-lat",
  regionLabel: "Đà Lạt / Cầu Đất, Lâm Đồng",
  altitudeLabel: "1.400–1.600 m",
  process: "washed",
  roastLevel: "light-medium",
  flavor: {
    bitterness: 2,
    acidity: 3,
    sweetness: 4,
    body: 3,
    aroma: 4,
    notes: ["Cam vàng", "Caramel", "Chocolate sữa", "Trà đen"],
    caffeine: "medium",
  },
  brewMethods: ["pour-over", "drip", "french-press", "phin"],
  story:
    "Catimor mở ra phía thanh sáng của cà phê Việt, đủ cân bằng cho người mới thử Arabica và linh hoạt từ pour-over đến drip bag.",
  varietyFacts: [
    "Đặc điểm giống chỉ là Reference Data; hương vị cụ thể vẫn phụ thuộc lô, sơ chế và rang.",
  ],
  badges: ["Easy Arabica", "Washed"],
  accent: "#71838a",
  pattern: "fine-mountain-lines",
  image: {
    src: "/images/products/catimor-da-lat-pack.webp",
    alt: "Gói cà phê DẤU VỊ Catimor màu sương với đường núi mảnh",
  },
  variants: createStandardVariants({
    skuPrefix: "CAT",
    price250: 139_000,
    price500: 259_000,
    dripBagPrice: 129_000,
  }),
  featuredLotCode: DEMO_LOT_CODES.catimor,
  published: true,
});

const xanhLun = createProduct({
  id: "xanh-lun-ts5",
  slug: "xanh-lun-ts5-bao-lam-honey",
  displayName: "Xanh Lùn TS5 Bảo Lâm Honey",
  shortName: "Xanh Lùn TS5",
  proposition: "Một giống Robusta có câu chuyện Việt Nam, được sơ chế Honey để tạo vị dày nhưng êm.",
  species: "robusta",
  scientificName: "Coffea canephora",
  variety: "Xanh Lùn TS5",
  segment: "Local Fine Robusta",
  role: "local-story",
  regionId: "bao-lam",
  regionLabel: "Bảo Lâm, Lâm Đồng",
  altitudeLabel: "800–1.000 m",
  process: "honey",
  roastLevel: "medium",
  flavor: {
    bitterness: 3,
    acidity: 2,
    sweetness: 4,
    body: 5,
    aroma: 4,
    notes: ["Mật ong", "Cacao", "Quả chín", "Đường nâu"],
    caffeine: "high",
  },
  brewMethods: ["phin", "espresso", "moka-pot"],
  story:
    "Xanh Lùn TS5 đưa câu chuyện giống cà phê Việt vào một profile Honey tròn vị, vừa giữ body Robusta vừa tăng cảm giác ngọt.",
  varietyFacts: [
    "Khả năng chịu hạn là thông tin tham khảo về giống, không phải bằng chứng rằng toàn bộ lô sản phẩm tiết kiệm nước.",
  ],
  badges: ["Vietnamese Variety", "Honey Process"],
  accent: "#3f6b52",
  pattern: "compact-rounded-contour",
  image: {
    src: "/images/products/xanh-lun-ts5-pack.webp",
    alt: "Gói cà phê DẤU VỊ Xanh Lùn TS5 màu lá với đường đồng mức bo tròn",
  },
  variants: createStandardVariants({
    skuPrefix: "XLTS5",
    price250: 159_000,
    price500: 299_000,
  }),
  featuredLotCode: DEMO_LOT_CODES.xanhLun,
  published: true,
});

const trs1 = createProduct({
  id: "trs1",
  slug: "trs1-tay-nguyen-daily-phin",
  displayName: "TRS1 Tây Nguyên Daily Phin",
  shortName: "TRS1 Daily Phin",
  proposition: "Robusta đậm, dễ pha và dễ tiếp cận cho tách phin mỗi ngày.",
  species: "robusta",
  scientificName: "Coffea canephora",
  variety: "TRS1",
  segment: "Everyday",
  role: "bestseller",
  regionId: "gia-lai",
  regionLabel: "Gia Lai, Tây Nguyên",
  altitudeLabel: "600–800 m",
  process: "natural",
  roastLevel: "medium-dark",
  flavor: {
    bitterness: 5,
    acidity: 1,
    sweetness: 2,
    body: 5,
    aroma: 3,
    notes: ["Chocolate đen", "Hạt rang", "Caramel nhẹ"],
    caffeine: "high",
  },
  brewMethods: ["phin", "moka-pot", "espresso"],
  story:
    "Một lựa chọn thẳng thắn cho tách phin buổi sáng: đậm, dày, dễ phối cùng sữa và giữ mức giá dễ tiếp cận.",
  varietyFacts: [
    "Mô tả giống là Reference Data; hồ sơ lô demo không phải dữ liệu sản xuất đã được xác minh.",
  ],
  badges: ["Daily Phin"],
  accent: "#5a3729",
  pattern: "broad-horizontal-contour",
  image: {
    src: "/images/products/trs1-daily-phin-pack.webp",
    alt: "Gói cà phê DẤU VỊ TRS1 màu bazan với đường đồng mức ngang",
  },
  variants: createStandardVariants({
    skuPrefix: "TRS1",
    price250: 99_000,
    price500: 185_000,
  }),
  featuredLotCode: DEMO_LOT_CODES.trs1,
  published: true,
});

const tr9 = createProduct({
  id: "tr9",
  slug: "tr9-large-bean-fine-robusta",
  displayName: "TR9 Large Bean Fine Robusta",
  shortName: "TR9 Large Bean",
  proposition: "Fine Robusta hạt lớn với cấu trúc tròn, vị chocolate sữa và trái cây khô nhẹ.",
  species: "robusta",
  scientificName: "Coffea canephora",
  variety: "TR9",
  segment: "Fine Robusta",
  role: "fine-robusta",
  regionId: "dak-lak",
  regionLabel: "Đắk Lắk",
  altitudeLabel: "500–800 m",
  process: "honey",
  roastLevel: "medium",
  flavor: {
    bitterness: 3,
    acidity: 2,
    sweetness: 4,
    body: 5,
    aroma: 4,
    notes: ["Chocolate sữa", "Đường nâu", "Hạt dẻ", "Trái cây khô"],
    caffeine: "high",
  },
  brewMethods: ["phin", "espresso", "french-press"],
  story:
    "TR9 cho thấy một sắc thái Robusta mềm hơn, với sơ chế Honey, độ ngọt rõ và cấu trúc phù hợp cho cả phin lẫn French press.",
  varietyFacts: [
    "Kích thước hạt và mô tả giống là Reference Data, không phải một chứng nhận chất lượng độc lập.",
  ],
  badges: ["Large Bean", "Fine Robusta"],
  accent: "#c79648",
  pattern: "large-bean-dot-grid",
  image: {
    src: "/images/products/tr9-large-bean-pack.webp",
    alt: "Gói cà phê DẤU VỊ TR9 màu mật ong với lưới chấm hạt lớn",
  },
  variants: createStandardVariants({
    skuPrefix: "TR9",
    price250: 139_000,
    price500: 259_000,
  }),
  featuredLotCode: DEMO_LOT_CODES.tr9,
  published: true,
});

const bourbon = createProduct({
  id: "bourbon",
  slug: "bourbon-langbiang-honey",
  displayName: "Bourbon Langbiang Honey",
  shortName: "Bourbon Langbiang",
  proposition: "Heritage Arabica thanh mượt, nổi bật với mật ong, cam ngọt và hạnh nhân.",
  species: "arabica",
  scientificName: "Coffea arabica",
  variety: "Bourbon",
  segment: "Specialty",
  role: "premium",
  regionId: "langbiang",
  regionLabel: "Langbiang, Lâm Đồng",
  altitudeLabel: "1.500–1.700 m",
  process: "honey",
  roastLevel: "light-medium",
  flavor: {
    bitterness: 1,
    acidity: 4,
    sweetness: 5,
    body: 3,
    aroma: 5,
    notes: ["Mật ong", "Cam ngọt", "Caramel", "Hạnh nhân"],
    caffeine: "medium",
  },
  brewMethods: ["pour-over", "aeropress", "drip"],
  story:
    "Bourbon khép lại hành trình vị giác ở phía thanh và thơm, dành cho những lần pha chậm bằng pour-over hoặc AeroPress.",
  varietyFacts: [
    "Các mô tả về giống Bourbon là Reference Data; profile thực tế được quyết định bởi hồ sơ từng lô.",
  ],
  badges: ["Heritage Arabica", "Langbiang Origin", "Small Lot"],
  accent: "#9b4f58",
  pattern: "high-altitude-thin-contour",
  image: {
    src: "/images/products/bourbon-langbiang-pack.webp",
    alt: "Gói cà phê DẤU VỊ Bourbon màu berry và mật ong với đường cao độ mảnh",
  },
  variants: createStandardVariants({
    skuPrefix: "BBN",
    price250: 199_000,
    price500: 379_000,
  }),
  featuredLotCode: DEMO_LOT_CODES.bourbon,
  published: true,
});

/** Display order is part of the collection editorial hierarchy. */
export const mockProducts = productArraySchema.parse([
  tr4,
  catimor,
  xanhLun,
  trs1,
  tr9,
  bourbon,
]);

export const mockProductById = new Map(mockProducts.map((product) => [product.id, product]));

