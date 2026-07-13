export interface BrewMethodGuide {
  id:
    | "phin"
    | "pour-over"
    | "aeropress"
    | "moka-pot"
    | "french-press"
    | "cold-brew";
  name: string;
  shortDescription: string;
  dose: string;
  water: string;
  grind: string;
  time: string;
  recommendations: string[];
}

export const BREW_METHODS: BrewMethodGuide[] = [
  {
    id: "phin",
    name: "Phin Việt Nam",
    shortDescription: "Chậm rãi, đậm và tròn vị.",
    dose: "20 g cà phê",
    water: "80–100 ml nước",
    grind: "Xay vừa mịn",
    time: "4–6 phút",
    recommendations: ["TRS1", "TR4", "Xanh Lùn TS5"],
  },
  {
    id: "pour-over",
    name: "Pour-over",
    shortDescription: "Làm rõ hương thơm và độ chua sáng.",
    dose: "15 g cà phê",
    water: "240 ml nước",
    grind: "Xay vừa",
    time: "2:30–3:00",
    recommendations: ["Catimor", "Bourbon"],
  },
  {
    id: "aeropress",
    name: "AeroPress",
    shortDescription: "Linh hoạt cho tách cân bằng và sạch vị.",
    dose: "15–17 g cà phê",
    water: "220 ml nước",
    grind: "Xay vừa mịn",
    time: "1:30–2:00",
    recommendations: ["Catimor", "Bourbon", "TR9"],
  },
  {
    id: "moka-pot",
    name: "Moka pot",
    shortDescription: "Tách cô đọng, hợp cà phê có body dày.",
    dose: "Theo phễu cà phê",
    water: "Theo mức van an toàn",
    grind: "Xay mịn vừa",
    time: "Theo dung tích bình",
    recommendations: ["TRS1", "TR4", "Xanh Lùn TS5"],
  },
  {
    id: "french-press",
    name: "French press",
    shortDescription: "Giữ body và cảm giác tròn trong miệng.",
    dose: "Điều chỉnh theo dung tích",
    water: "Theo tỷ lệ bạn quen dùng",
    grind: "Xay thô",
    time: "Bắt đầu từ 4 phút",
    recommendations: ["TR9", "Catimor"],
  },
  {
    id: "cold-brew",
    name: "Cold brew",
    shortDescription: "Ủ lạnh cho tách êm và tiện chuẩn bị trước.",
    dose: "Điều chỉnh theo độ cô đặc",
    water: "Nước mát",
    grind: "Xay thô",
    time: "12–16 giờ",
    recommendations: ["TR4", "TR9"],
  },
];

export const BREW_GUIDE_NOTE =
  "Các thông số là điểm khởi đầu gợi ý, không phải quy chuẩn duy nhất. Hãy điều chỉnh độ xay, lượng nước và thời gian theo dụng cụ cùng khẩu vị của bạn.";

export const HOME_BREW_PATHWAYS = [
  BREW_METHODS[0],
  {
    id: "pour-over-aeropress",
    name: "Pour-over / AeroPress",
    shortDescription: "Cho tách thanh hơn và giàu hương.",
    grind: "Xay vừa đến vừa mịn",
    dose: "15–17 g cà phê",
    water: "220–240 ml nước",
    time: "1:30–3:00",
    recommendations: ["Catimor", "Bourbon", "TR9"],
  },
  {
    id: "drip-bag",
    name: "Drip bag",
    shortDescription: "Pha nhanh tại văn phòng hoặc khi di chuyển.",
    grind: "Đã xay sẵn",
    dose: "1 gói × 12 g",
    water: "Theo hướng dẫn trên gói",
    time: "Khoảng 2–3 phút",
    recommendations: ["Catimor"],
  },
] as const;
