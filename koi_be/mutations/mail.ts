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
        border: 1px solid #ddd;
        padding: 20px;
        font-family: Arial, sans-serif;
        line-height: 1.6;
        font-size: 18px;
        color: #333;
        background-color: #f9f9f9;
        max-width: 600px;
        margin: auto;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      ">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="
            display: inline-block;
            color: #007bff;
            font-size: 24px;
            font-weight: bold;
            vertical-align: middle;
            margin: 0;
          ">Hệ thống Cá Koi Viet xin thông báo</h2>
        </div>
        
        <p style="
          font-size: 18px;
          color: #555;
          text-align: center;
        ">${text} của bạn đã được thanh toán thành công</p>
        
        <p style="
          text-align: center;
          font-size: 24px;
          color: #555;
        ">Cá Koi Việt</p>
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

  return "Ký gửi cá thành công";
}

type ArgumentsLogin = {
  to: string;
  userId: string;
};

function makeRegisterEmail(text: string) {
  return `
    <div className="email" style="
      border: 1px solid #ddd;
      padding: 20px;
      font-family: Arial, sans-serif;
      line-height: 1.6;
      font-size: 18px;
      color: #333;
      background-color: #f9f9f9;
      max-width: 600px;
      margin: auto;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    ">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="
          display: inline-block;
          color: #007bff;
          font-size: 24px;
          font-weight: bold;
          vertical-align: middle;
          margin: 0;
        ">Hệ thống Cá Koi Viet xin thông báo</h2>
      </div>
      
      <p style="
        font-size: 18px;
        color: #555;
        text-align: center;
      ">Xin chào, ${text}</p>
      
      <p style="
        font-size: 18px;
        color: #555;
        text-align: center;
      ">Bạn đã đăng ký tài khoản thành công</p>
      
      <p style="
        text-align: center;
        font-size: 24px;
      ">Cá Koi Việt</p>
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
