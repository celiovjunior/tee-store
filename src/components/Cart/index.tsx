import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import Image from "next/image";
import { X } from "phosphor-react";
import { useState } from "react";
import { useCart } from "../../hooks/useCart";
import { CartButton } from "../CartButton";
import { CartClose, CartContent, CartFinalization, CartProduct, CartProductDetails, CartProductImage, FinalizationDetails } from "./styles";

export function Cart() {
  const { cartItems, removeCartItem, cartTotal } = useCart()
  const cartQuantity  = cartItems.length

  const formattedCartTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cartTotal)

  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)

  async function handleCheckout() {
    try {
      setIsCreatingCheckoutSession(true)
      const response = await axios.post('/api/checkout', {
        products: cartItems
      })
      const { checkoutUrl } = response.data
      window.location.href = checkoutUrl
    } catch (err) {
      setIsCreatingCheckoutSession(false)
      alert('Falha ao redirecionar ao Checkout')
    }
  }

  return(
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <CartButton />
      </Dialog.Trigger>

      <Dialog.Portal>
        <CartContent>
          <CartClose>
            <X size={24} weight="bold" />
          </CartClose>

          <h2>Itens selecionados</h2>

          <section>
            {cartQuantity <= 0 && <p>Seu carrinho está vazio 😔</p> }

            {
              cartItems.map(cartItem => (
                <CartProduct key={cartItem.id}>
                  <CartProductImage>
                    <Image
                      src={cartItem.imageUrl}
                      width={100}
                      height={93}
                      alt={cartItem.name}
                    />
                  </CartProductImage>
                  <CartProductDetails>
                    <p>{cartItem.name}</p>
                    <strong>{cartItem.price}</strong>
                    <button onClick={() => removeCartItem(cartItem.id)}>Remover</button>
                  </CartProductDetails>
                </CartProduct>
              ))
            }
          </section>

          <CartFinalization>

            <FinalizationDetails>
              <div>
                <span>Quantidade</span>
                <p>{cartQuantity} {cartQuantity > 1 ? 'itens' : 'item'} </p>
              </div>  
              <div>
                <span>Valor total</span>
                <p>{formattedCartTotal}</p>
              </div>
            </FinalizationDetails>
            
            <button 
              onClick={handleCheckout} 
              disabled={isCreatingCheckoutSession || cartQuantity < 0}
            >Finalizar compra</button>
          </CartFinalization>

        </CartContent>
      </Dialog.Portal>

    </Dialog.Root>
  )
}