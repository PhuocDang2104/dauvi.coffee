export const STORY_CONTENT = {
  hero: {
    eyebrow: "FROM THE HIGHLANDS OF VIETNAM",
    title: "Từ đất bazan đến sườn núi mờ sương",
    introduction:
      "Sáu dòng cà phê, hai hệ hương vị, một hành trình xuyên cao nguyên Việt Nam. Robusta đậm đà từ Tây Nguyên và Arabica thanh sáng từ Lâm Đồng được kể bằng hồ sơ nguồn gốc đến từng lô.",
  },
  longForm: [
    "Câu chuyện bắt đầu từ những vùng đất đỏ bazan của Tây Nguyên, nơi TRS1, TR4, TR9 và Xanh Lùn TS5 phát triển trong khí hậu nhiệt đới đặc trưng. Đây là những giống Robusta gắn với quá trình tuyển chọn và phát triển cà phê tại Việt Nam, mang body dày, vị đậm và nguồn năng lượng phù hợp với văn hóa pha phin.",
    "Hành trình tiếp tục lên những vùng cao mát hơn của Lâm Đồng. Tại Đà Lạt, Cầu Đất và Langbiang, Catimor và Bourbon tạo nên những tách cà phê thanh hơn, có hương hoa, trái cây, caramel và mật ong. Chúng kể một phần khác của cà phê Việt: những lô Arabica nhỏ, được tạo nên bởi độ cao, khí hậu và cách sơ chế.",
    "Sáu sản phẩm không được đặt cạnh nhau để chọn ra loại tốt nhất. Chúng tạo thành một hành trình vị giác, từ một ly phin Robusta đậm đà mỗi sáng đến một tách Bourbon nhẹ và thơm được pha bằng pour-over.",
    "Mỗi gói mang thông tin về giống, vùng trồng, phương pháp sơ chế, mức rang và mã lô. Người mua không chỉ biết mình đang uống gì, mà còn biết sản phẩm đến từ đâu và vì sao nó có hương vị ấy.",
  ],
  highlands: [
    {
      id: "robusta",
      eyebrow: "ROBUSTA HIGHLANDS",
      title: "Tây Nguyên",
      description: "Body dày, caffeine cao, hợp phin và espresso.",
      traits: ["Đậm", "Body dày", "Caffeine cao", "Phin / Espresso"],
    },
    {
      id: "arabica",
      eyebrow: "ARABICA HIGHLANDS",
      title: "Lâm Đồng",
      description: "Hương hoa và trái cây, acidity rõ, hợp pour-over và drip.",
      traits: ["Thanh", "Giàu hương", "Acidity rõ", "Pour-over / Drip"],
    },
  ],
  journey: ["Giống", "Vùng", "Sơ chế", "Rang", "Mã lô", "Tách cà phê"],
  transparency: {
    title: "Lời hứa về tính minh bạch",
    description:
      "Chúng tôi phân biệt rõ dữ liệu đã xác minh, thông tin nhà cung cấp khai báo, kiến thức tham khảo và dữ liệu mô phỏng. Một nhãn đẹp không thay thế cho bằng chứng.",
  },
} as const;
