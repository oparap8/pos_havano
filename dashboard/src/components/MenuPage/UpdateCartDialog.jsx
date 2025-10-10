import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/useCartStore";

const UpdateCartDialog = () => {
  const updateCartItem = useCartStore((state) => state.updateCartItem);
  const selectedItem = useCartStore((state) => state.selectedCartItem);
  const isOpen = useCartStore((state) => state.isUpdateDialogOpen);
  const closeUpdateDialog = useCartStore((state) => state.closeUpdateDialog);

  // Local state for form fields
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [remark, setRemark] = useState("");

  // Populate form when item changes
  useEffect(() => {
    if (selectedItem) {
      setPrice(selectedItem.price ?? "");
      setQuantity(selectedItem.quantity ?? "");
      setRemark(selectedItem.remark ?? "");
    } else {
      setPrice("");
      setQuantity("");
      setRemark("");
    }
  }, [selectedItem]);

  const handleConfirm = () => {
    if (!quantity || !price) return;
    if (!selectedItem?.name) return;
    updateCartItem({
      ...selectedItem,
      price: Number(price),
      quantity: Number(quantity),
      remark,
    });
    closeUpdateDialog();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeUpdateDialog();
        }
      }}
    >
      <DialogContent className="p-6 rounded-xl bg-white shadow-lg">
        <div>
          <DialogHeader className="mb-4">
            {selectedItem?.name && (
              <DialogTitle className="text-xl font-semibold">
                {selectedItem.item_name || selectedItem.name}
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
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full"
              />
            </div>
            {/* Preparation Remark */}
            <div>
              <label className="block text-sm font-medium mb-1">Preparation Remark</label>
              <Textarea
                value={remark}
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
                closeUpdateDialog();
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
