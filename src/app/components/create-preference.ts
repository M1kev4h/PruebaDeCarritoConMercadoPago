import { NextApiRequest, NextApiResponse } from "next";
import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN as string,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { cart } = req.body;

     
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items = cart.map((item: any) => ({
        title: item.product.name,
        unit_price: item.product.price,
        quantity: item.quantity,
      }));

      
      const preference = await mercadopago.preferences.create({
        items,
        back_urls: {
          success: "http://localhost:3000/success",
          failure: "http://localhost:3000/failure",
          pending: "http://localhost:3000/pending",
        },
        auto_return: "approved", 
      });

      res.status(200).json({ init_point: preference.body.init_point });
    } catch (error) {
      console.error("Error al crear la preferencia:", error);
      res.status(500).json({ error: "Hubo un problema al procesar el pago" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
