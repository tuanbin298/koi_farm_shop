import nodemailer from "nodemailer";
import { KeystoneContext } from "@keystone-6/core/types";
import "dotenv/config";

// @ts-ignore
let transporter = nodemailer.createTransport({
  // port: process.env.MAIL_PORT,
  host: process.env.MAIL_HOST,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeConsignmentSaleEmail(text: string) {
  return `
      <div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;
      ">
        <h2>Hệ thống Cá Koi Viet xin thông báo</h2>
        <p>${text} của bạn đã được thanh toán thành công</p>
        <p>Cá Koi Việt😘</p>
      </div>
    `;
}

type Arguments = {
  to: string;
  consignmentId: string;
};

export async function createSuccessConsignmentSaleEmail(
  root: any,
  { to, consignmentId }: Arguments,
  context: KeystoneContext
): Promise<String> {
  const consignment = await context.sudo().query.ConsignmentSale.findOne({
    where: {
      id: consignmentId,
    },
    query: "id name",
  });

  const info = await transporter.sendMail({
    to,
    from: "koiviet@gmail.com",
    subject: "THÔNG TIN VỀ ĐƠN HÀNG KÝ GỬI BÁN",
    html: makeConsignmentSaleEmail(consignment.name),
  });
  console.log({ info });

  return "Gửi thành công";
}

type ArgumentsLogin = {
  to: string;
  userId: string;
};

function makeRegisterEmail(text: string) {
  return `
    <div className="email" style="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;
    ">
      <h2>Hệ thống Cá Koi Viet xin thông báo</h2>
      <p>Xin chào, ${text}</p>
      <p>Bạn đã đăng ký tài khoản thành công</p>
      <p>Cá Koi Việt😘</p>
    </div>
`;
}

export async function createSuccessLoginEmail(
  root: any,
  { to, userId }: ArgumentsLogin,
  context: KeystoneContext
): Promise<String> {
  console.log("User ID:", userId);

  const user = await context.sudo().query.User.findOne({
    where: {
      id: userId,
    },
    query: "id name",
  });

  const info = await transporter.sendMail({
    to,
    from: "koiviet@gmail.com",
    subject: "THÔNG BÁO ĐĂNG KÝ TÀI KHOẢN THÀNH CÔNG",
    html: makeRegisterEmail(user.name),
  });
  console.log({ info });

  return "Tạo tài khoản thành công";
}
