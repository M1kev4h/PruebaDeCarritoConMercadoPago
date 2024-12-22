"use client";
import { useState } from "react";
import { createPreferece } from "../actions/preferences/action";

type Product = {
  id: number;
  name: string;
  price: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

const products: Product[] = [
  { id: 1, name: "Producto 1", price: 10 },
  { id: 2, name: "Producto 2", price: 20 },
  { id: 3, name: "Producto 3", price: 30 },
];

// const handleCheckout = async (cart: CartItem[]) => {
//   try {
//     const response = await fetch("/api/create-preference", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ cart }),
//     });

//     if (!response.ok) {
//       throw new Error("Error al procesar el pago");
//     }

//     const { init_point } = await response.json();

//     window.location.href = init_point;
//   } catch (error) {
//     console.error("Error al procesar el pago:", error);
//     alert("Hubo un problema al procesar tu pago");
//   }
// };

export const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tienda</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {products.map((product) => (
          <div key={product.id} className="p-4 border rounded shadow">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-600">Precio: ${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">Carrito</h2>
      {cart.length === 0 ? (
        <p className="text-gray-600">El carrito está vacío.</p>
      ) : (
        <form
          className="space-y-4"
          action={async () => await createPreferece(cart)}
        >
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">Cantidad: {item.quantity}</p>
                <p className="text-gray-600">
                  Subtotal: ${item.product.price * item.quantity}
                </p>
              </div>
              <div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  -
                </button>
              </div>
            </div>
          ))}
          <div className="text-right font-bold text-lg">
            Total: ${calculateTotal()}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Finalizar Compra
          </button>
        </form>
      )}
    </div>
  );
};
