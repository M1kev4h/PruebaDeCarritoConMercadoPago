"use server";

import { CartItem } from "@/app/components/Cart";
import MercadoPagoConfig, { Preference } from "mercadopago";
import { redirect } from "next/navigation";

export const createPreferece = async (cart: CartItem[]) => {
  const baseURL = "https://notification-seconds-sky-failed.trycloudflare.com";

  const config = new MercadoPagoConfig({
    accessToken: process.env.ACCESS_TOKEN as string,
  });

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

  redirect(preference.init_point!);
};
