import MenuCategories from "@/components/MenuPage/MenuCategories";
import Container from "@/components/Shared/Container";
import { createContext, useState } from "react";
import Menu from "@/components/MenuPage/Menu";
import Cart from "@/components/MenuPage/Cart";
import NumPad from "@/components/MenuPage/UpdateCartDialog";

export const MenuCartContext = createContext();

const MenuPage = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const addToCart = (item) => {
    setCart((prevCart) => {
      const itemInCart = prevCart.find((cartItem) => cartItem.id === item.id);
      if (itemInCart) {
        // Replace quantity with the new value
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Add as a new item
        return [...prevCart, item];
      }
    });
    console.log(cart);
  };

  const updateCartItem = (updatedItem) => {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === updatedItem.id
          ? { ...cartItem, ...updatedItem }
          : cartItem
      )
    );
  };
  const removeFromCart = (item) => {
    setCart(cart.filter((cartItem) => cartItem.id !== item.id));
  };

  return (
    <MenuCartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        selectedCategory,
        setSelectedCategory,
        updateCartItem,
      }}
    >
      <Container>
        <div className="grid grid-cols-7 gap-4 relative z-0">
          <div className="col-span-5">
            <MenuCategories />
            <Menu />
          </div>
          <div className="col-span-2">
            <Cart />
          </div>
        </div>
      </Container>
    </MenuCartContext.Provider>
  );
};

export default MenuPage;
