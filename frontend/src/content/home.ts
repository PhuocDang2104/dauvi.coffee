export const HOME_CONTENT = {
  hero: {
    eyebrow: "VIETNAM TRACEABLE COFFEE COLLECTION",
    title: "Cà phê Việt Nam, được kể đến từng lô.",
    description:
      "Từ Robusta Tây Nguyên đến Arabica Langbiang, khám phá sáu dòng cà phê đóng gói theo giống, vùng trồng, cách sơ chế và hương vị.",
    primaryAction: { label: "Khám phá bộ sưu tập", href: "/shop" },
    secondaryAction: {
      label: "Để Coffee Advisor chọn giúp",
      href: "/advisor",
    },
    routeLabel: "Đắk Lắk → Đà Lạt",
    dataLabels: ["Natural", "500–800 m", "Lot TR4-DLK-26-N02"],
  },
  collection: {
    eyebrow: "THE COLLECTION",
    title: "Sáu sản phẩm, một hành trình Việt Nam",
    description:
      "Bốn Robusta và hai Arabica mở ra một phổ vị từ đậm, dày đến thanh, giàu hương.",
    metrics: [
      { value: "04", label: "Robusta" },
      { value: "02", label: "Arabica" },
      { value: "03", label: "Phương pháp sơ chế" },
      { value: "05", label: "Vùng cà phê" },
    ],
    legend: [
      {
        label: "Robusta",
        description: "Đậm, body dày và thường có caffeine cao hơn.",
      },
      {
        label: "Arabica",
        description: "Thanh hơn, hương thơm và độ chua thường rõ hơn.",
      },
    ],
  },
  flavorMap: {
    eyebrow: "VIETNAM FLAVOR MAP",
    title: "Một bản đồ, nhiều sắc thái cà phê",
    description:
      "Theo hành trình từ cao nguyên bazan đến những sườn núi mát của Lâm Đồng.",
    textAlternative:
      "Bản đồ Việt Nam đánh dấu năm vùng trong bộ sưu tập: Gia Lai, Đắk Lắk, Bảo Lâm, Đà Lạt và Langbiang.",
  },
  featuredProducts: {
    eyebrow: "SIX COFFEES",
    title: "Chọn điểm bắt đầu của bạn",
    description:
      "Mỗi gói có một vai trò riêng — từ tách phin mỗi ngày đến trải nghiệm Arabica vùng cao.",
  },
  traceability: {
    eyebrow: "LOT-LEVEL TRACEABILITY",
    title: "Theo dấu từ vùng trồng đến ngày rang",
    description:
      "Mỗi hồ sơ trình bày hành trình lô cùng mức bằng chứng của từng trường dữ liệu.",
    action: { label: "Tra cứu mã lô", href: "/traceability" },
    demoLotCode: "TR4-DLK-26-N02",
    disclosure: "Dữ liệu lô đang được mô phỏng cho mục đích trình diễn đồ án.",
    timeline: [
      "Vùng trồng",
      "Thu hoạch",
      "Sơ chế",
      "Cà phê nhân",
      "Rang",
      "Đóng gói",
    ],
  },
  tasteSpectrum: {
    eyebrow: "TASTE SPECTRUM",
    title: "Bắt đầu từ khẩu vị của bạn",
    startLabel: "Đậm & nhiều caffeine",
    endLabel: "Thanh & giàu hương",
    productLabels: ["TRS1", "TR4", "TR9", "Xanh Lùn", "Catimor", "Bourbon"],
    action: { label: "Tìm cà phê phù hợp", href: "/advisor" },
  },
  advisor: {
    eyebrow: "COFFEE ADVISOR",
    title: "Không cần biết hết thuật ngữ để chọn đúng cà phê",
    description:
      "Trả lời vài câu về vị, cách pha và ngân sách. Coffee Advisor sẽ chọn ba sản phẩm phù hợp từ bộ sưu tập hiện có.",
    prompts: [
      "Tôi uống phin mỗi sáng.",
      "Tôi thích ít đắng hơn.",
      "Tôi muốn thử Arabica.",
      "Tôi cần drip bag tiện lợi.",
    ],
    action: { label: "Bắt đầu tư vấn", href: "/advisor" },
  },
  brewAtHome: {
    eyebrow: "BREW AT HOME",
    title: "Pha theo nhịp sống của bạn",
    description:
      "Bắt đầu với một công thức gợi ý, rồi điều chỉnh để hợp khẩu vị và dụng cụ.",
    action: { label: "Xem hướng dẫn pha", href: "/brew-guide" },
  },
  newsletter: {
    eyebrow: "FIELD NOTES",
    title: "Field Notes từ cao nguyên",
    description: "Nhận câu chuyện vùng trồng, cách pha và các lô mới.",
  },
} as const;
