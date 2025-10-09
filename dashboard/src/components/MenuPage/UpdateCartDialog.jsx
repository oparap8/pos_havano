import { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MenuCartContext } from "@/routes/pages/MenuPage";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const UpdateCartDialog = ({ isOpen, setIsOpen, item = {} }) => {
  const { updateCartItem } = useContext(MenuCartContext);

  // Local state for form fields
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [remark, setRemark] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  // Populate form when item changes
  useEffect(() => {
    if (item) {
      setPrice(item.price ?? "");
      setQuantity(item.quantity ?? "");
      setRemark(item.remark ?? "");
    }
  }, [item]);

  const handleConfirm = () => {
    if (!quantity || !price) return;
    updateCartItem({
      ...item,
      price: Number(price),
      quantity: Number(quantity),
      remark,
    });
    setIsOpen(false);
    setFocusedField(null); // close keyboard too
  };

  const onKeyboardChange = (input) => {
    if (focusedField === "price") setPrice(input);
    if (focusedField === "quantity") setQuantity(input);
    if (focusedField === "remark") setRemark(input);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setFocusedField(null); // hide keyboard when dialog closes
      }}
    >
      <DialogContent className="p-6 rounded-xl bg-white shadow-lg">
        <div>
          <DialogHeader className="mb-4">
            {item?.name && (
              <DialogTitle className="text-xl font-semibold">
                {item.name}
              </DialogTitle>
            )}
          </DialogHeader>
          <div className="space-y-4">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <Input
                type="text"
                value={price}
                onFocus={() => setFocusedField("price")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full"
              />
            </div>
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <Input
                type="text"
                value={quantity}
                onFocus={() => setFocusedField("quantity")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full"
              />
            </div>
            {/* Preparation Remark */}
            <div>
              <label className="block text-sm font-medium mb-1">Preparation Remark</label>
              <Textarea
                value={remark}
                onFocus={() => setFocusedField("remark")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Add a preparation remark..."
                className="w-full"
              />
            </div>
          </div>
          {/* Actions */}
          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setFocusedField(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-cyan-600 text-white hover:bg-cyan-700"
              onClick={handleConfirm}
            >
              OK
            </Button>
          </div>
        </div>
        
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCartDialog;
