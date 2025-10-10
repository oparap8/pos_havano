import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cart: [],
  selectedCategory: { id: "all", name: "All" },
  selectedCartItem: null,
  isUpdateDialogOpen: false,

  addToCart: (item) =>
    set((state) => {
      const identifier = item.name;
      if (!identifier) {
        console.warn("Attempted to add cart item without a name identifier.", item);
        return {};
      }
      const existing = state.cart.find((cartItem) => cartItem.name === identifier);
      const normalizedQuantity = Number(item.quantity ?? 1);
      const resolvedPrice = item.price ?? item.standard_rate ?? 0;

      if (existing) {
        const increment = isNaN(normalizedQuantity) ? 1 : normalizedQuantity;
        return {
          cart: state.cart.map((cartItem) =>
            cartItem.name === identifier
              ? {
                  ...cartItem,
                  quantity: cartItem.quantity + increment,
                  price: resolvedPrice,
                }
              : cartItem
          ),
        };
      }

      return {
        cart: [
          ...state.cart,
          {
            ...item,
            quantity: isNaN(normalizedQuantity) ? 1 : normalizedQuantity,
            price: resolvedPrice,
          },
        ],
      };
    }),

  updateCartItem: (updatedItem) =>
    set((state) => {
      if (!updatedItem?.name) {
        console.warn("Attempted to update cart item without a name identifier.", updatedItem);
        return {};
      }
      return {
        cart: state.cart.map((cartItem) =>
          cartItem.name === updatedItem.name
            ? { ...cartItem, ...updatedItem }
            : cartItem
        ),
      };
    }),

  removeFromCart: (itemToRemove) =>
    set((state) => {
      if (!itemToRemove?.name) {
        console.warn("Attempted to remove cart item without a name identifier.", itemToRemove);
        return {};
      }
      return {
        cart: state.cart.filter((cartItem) => cartItem.name !== itemToRemove.name),
      };
    }),

  clearCart: () => set({ cart: [] }),

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  openUpdateDialog: (item) => {
    if (!item?.name) {
      console.warn("Attempted to open update dialog without a name identifier.", item);
      return;
    }
    set({
      selectedCartItem: { ...item },
      isUpdateDialogOpen: true,
    });
  },

  closeUpdateDialog: () =>
    set({
      selectedCartItem: null,
      isUpdateDialogOpen: false,
    }),
}));
