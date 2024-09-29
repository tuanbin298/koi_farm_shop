export const categories = [
  {
    name: "Cá koi Tancho",
    description:
      "Tancho Nuôi Ao Bùn được tạo ra và phát triển từ giống cá Kohaku. Đặc điểm trên loại cá này vẫn giữ được màu đỏ, màu trắng. Người ra thường sẽ đánh giá vẻ đẹp của loài cá này qua màu trắng. Nếu màu trắng trên thân cá càng sạch và rực rỡ thì cá sẽ càng có giá trị. Tancho Nuôi Ao Bùn có đặc điểm là thân nền trắng điểm thêm chấm tròn ở đầu, ngắm nhìn Tancho bơi lội, bạn sẽ thấy khá thích thú và thích mắt. Và với màu sắc nền trắng chấm tròn đỏ như một biểu tượng của quốc kỳ xứ Phù Tang.",
  },
  {
    name: "Cá koi vàng Yamabuki",
    description:
      "Cá Koi Yamabuki hay còn được gọi là cá Koi vàng ánh kim được biết đến là một thành viên thuộc lớp Hikari Muji. Loài cá này có nguồn gốc từ Nhật Bản với 2 biến thể chính là Ginrin Yamabuki Ogon Nuôi Ao Bùn Size Lớn và Doitsu Yamabuki Ogon Nuôi Ao Bùn Size Lớn.",
  },
  {
    name: "Cá koi Shusui",
    description:
      "Màu sắc chủ đạo trên thân cá là đen, trắng, đỏ, tuy nhiên một số cá thể Shusui Nuôi Ao Bùn Size Lớn đặc biệt còn có cả màu xanh ngọc. Các khoang màu được sắp xếp đối xứng cân đối đẹp mắt. Các màu sắc rõ nét, vảy màu xanh đen, thân cá màu đỏ thì đỏ chót, màu trắng thì trắng như tuyết. Ranh giới giữa các bệt màu rõ nét, không bị mờ nhòe.",
  },
  {
    name: "Cá koi Asagi",
    description:
      "Asagi là 1 trong những dòng cá Koi xuất hiện sớm nhất ở Nhật Bản. Cái tên của nó bắt nguồn từ ngôi làng sinh ra toàn bộ giống cá Koi Asagi  này làm nghề dệt vải giống hoa văn trên người những con cá. Giống cá này được coi là tổ tiên của các loại cá Koi Nishikigoi ra đời từ khoảng 160 năm trước, với hai dòng Kongo Asagi koi và Narumi Asagi đã lai tạo và cho ra những hậu duệ của giống Asagi Magoi (Narumi: tên của ngôi làng sản sinh ra toàn bộ giống Asagi).",
  },npm
  {
    name: "Cá Koi Hariwake",
    description:
      "Vẻ ngoài lấp lánh ánh kim Platinum với thiết kế từ Hi (đỏ) đến Yamabuki (vàng) của một con Hariwake Koi sẽ khiến bạn say đắm ngay lần đầu tiên. Dưới ánh nắng chiếu qua lớp vảy đó sẽ khiến vẻ đẹp càng làm xao xuyến lòng người hơn nữa. Hãy cùng tìm hiểu ngay về dòng cá Koi Hariwake có đặc điểm nổi bật gì và đâu là đơn vị cung cấp cá Koi chất lượng, giá tốt cho bạn trên thị trường.",
  },
  {
    name: "Cá koi Cọp Hikari Utsuri",
    description:
      "Cá koi Hikari Utsuri là giống chép Nhật màu sắc tương tự như Kin Showa, Kin Ki Utsuri, Kin Hi Utsuri, Gin Shiro Utsuri. Chúng chỉ đặc biệt hơn cá koi Utsuri bởi được bao phủ một lớp lấp lánh ánh kim loại toàn thân.",
  },
];

export const roles = [
  {
    name: "Staff",
    canManageUser: false,
    canManageProduct: false,
    canManageRole: false,
    canManageArticle: false,
    user: {
      connect: [
        {
          email: "staffA@gmail.com",
        },
        {
          email: "staffB@gmail.com",
        },
      ],
    },
  },
];

export const users = [
  {
    name: "staffA",
    email: "staffA@gmail.com",
    password: "123123",
    phone: "123123",
    address: "HCM",
  },
  {
    name: "staffB",
    email: "staffB@gmail.com",
    password: "123123",
    phone: "123123",
    address: "HCM",
  },
];

export const products = [
  {
    name: "Yamabuki Nuôi Ao Bùn",
    birth: 2019,
    sex: "Đực",
    size: "60cm",
    price: 123,
    description:
      "Chăm sóc dễ dàng. Ăn tạp; hiền; ưa hòa bình;  Điều kiện nước: 36 – 90°F, HK 2-12, pH 6,8 – 7,2; Kích thước hồ tối thiểu: 1000 gallon",
    origin: "Nhập khẩu Nhật bản",
    generic: "Cá Koi Nhật thuần chủng",
    category: "Cá koi vàng Yamabuki",
  },
  {
    name: "Tancho Nuôi Ao Bùn",
    birth: 2019,
    sex: "Đực",
    size: "60cm",
    price: 10,
    description:
      "Chăm sóc dễ dàng ; Ăn tạp; hiền; ưa hòa bình ; Màu sắc: Đỏ - Trắng; Điều kiện nước: 36 – 90°F, HK 2-12, pH 6,8 – 7,2; Kích thước hồ tối thiểu để nuôi cá: 1000 gallon.",
    origin: "Nhập khẩu Nhật bản",
    generic: "Cá Koi Nhật thuần chủng",
    category: "Cá koi Tancho",
  },
  {
    name: "Shusui Nuôi Ao Bùn",
    birth: 2019,
    sex: "Đực",
    size: "50cm",
    price: 15000000,
    description:
      "Chăm sóc dễ dàng; Chế độ ăn: Ăn tạp; Tính cách: Hòa bình; Màu sắc: Đen, đỏ, trắng",
    origin: "Nhập khẩu Nhật bản",
    generic: "Cá Koi Nhật thuần chủng",
    category: "Cá koi Shusui",
  },
  {
    name: "Grinrin Asagi Nuôi Ao Bùn",
    birth: 2019,
    sex: "Cái",
    size: "30cm",
    price: 4500000,
    description: "Chăm sóc dễ dàng ; Chế độ ăn: Ăn tạp ; Tính cách: Hòa bình",
    origin: "Nhập khẩu Nhật bản",
    generic: "Cá Koi Nhật thuần chủng",
    category: "Cá koi Asagi",
  },
  {
    name: "Hi Utsuri Nuôi Ao Bùn",
    birth: 2021,
    sex: "Cái",
    size: "40cm",
    price: 7500000,
    description:
      "Mắt của cá koi Hi Utsuri có hình dáng tròn và có màu đen sâu, tạo nên vẻ đẹp quyến rũ cho giống cá này. Râu của cá koi Hi Utsuri cũng là một trong những đặc điểm nổi bật, chúng có chiều dài và độ dày hơn hẳn các giống cá Koi. ",
    origin: "Nhập khẩu Nhật bản",
    generic: "Cá Koi Nhật thuần chủng",
    category: "Cá koi Cọp Hikari Utsuri",
  },
  {
    name: "Cá Koi Hariwake",
    birth: 2019,
    sex: "Cái",
    size: "20cm",
    price: 2200000,
    description:
      "Kích thước: 50-65cm ; Chăm sóc dễ dàng ; Chế độ ăn: Ăn tạp ; Tính cách: Hòa bình; Màu sắc: Vàng - Trắng",
    origin: "Nhập khẩu Nhật bản",
    generic: "Nhật Bản",
    category: "Cá Koi Hariwake",
  },
];

export const articles = [];
