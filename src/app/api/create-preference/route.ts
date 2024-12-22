import { NextApiRequest, NextApiResponse } from "next";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { CartItem } from "@/app/components/Cart";
// import { Items } from "mercadopago/dist/clients/commonTypes";

const config = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN as string,
});

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { cart } = req.body as {
    cart: CartItem[];
  };

  const baseURL = "https://notification-seconds-sky-failed.trycloudflare.com";

  const items = cart.map((item) => ({
    id: item.product.id.toString(),
    title: item.product.name,
    unit_price: item.product.price,
    quantity: item.quantity,
  }));

  const preferenceObj = new Preference(config);
  const preference = await preferenceObj.create({
    body: {
      items,
      back_urls: {
        success: `${baseURL}/success`,
        failure: `${baseURL}/failure`,
        pending: `${baseURL}/pending`,
      },
      auto_return: "approved",
    },
  });

  return res.status(200).json({ init_point: preference.init_point });
}
