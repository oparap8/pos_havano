import Container from "@/components/Shared/Container";
import Error from "@/components/Error";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Eye, PenBox, Printer } from "lucide-react";
import { useWaiterStore } from "@/stores/useWaiterStore";
import { useOrderStore } from "@/stores/useOrderStore";
import { useTableStore } from "@/stores/useTableStore";
import { useCartStore } from "@/stores/useCartStore";
import { formatCurrency } from "@/lib/utils";
import Loader from "@/components/Loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";
import { db } from "@/lib/frappeClient";

const TableDetails = () => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const [viewOrderLoading, setViewOrderLoading] = useState(false);
  const [viewOrderError, setViewOrderError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTableStatusUpdating, setIsTableStatusUpdating] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { register, setValue, watch } = useForm({
    defaultValues: {
      customerName: "",
      waiter: "",
      remarks: "",
    },
  });
  const { waiters, loadingWaiters, errorWaiters, fetchWaiters } =
    useWaiterStore();

  const {
    tableOrders,
    tableOrdersLoading,
    tableOrdersError,
    fetchTableOrders,
  } = useOrderStore();

  const {
    tableDetails,
    loadingTableDetails,
    errorTableDetails,
    fetchTableDetails,
  } = useTableStore();

  const { startTableOrder, loadCartFromOrder } = useCartStore();

  useEffect(() => {
    if (!id) return;
    fetchTableDetails(id);
  }, [id, fetchTableDetails]);

  useEffect(() => {
    if (!id) return;
    fetchTableOrders(id);
    fetchWaiters();
  }, [id, fetchTableOrders, fetchWaiters]);

  useEffect(() => {
    if (tableOrders.length === 0) {
      setValue("waiter", "");
      return;
    }
    const activeWaiter = tableOrders.find((order) => order.waiter);
    if (activeWaiter?.waiter) {
      setValue("waiter", activeWaiter.waiter);
    } else {
      setValue("waiter", "");
    }
  }, [tableOrders, setValue]);

  const submitText = (status) => {
    if (status === "Available") {
      return "Assign Table";
    } else if (status === "Occupied") {
      return "Mark as Paid";
    } else if (status === "Booked") {
      return "Close Table";
    }
  };

  const handleNewOrder = () => {
    startTableOrder(id, watch("waiter"), null, watch("customerName"));
    navigate(`/menu`);
  };

  const closeViewDialog = () => {
    setIsViewDialogOpen(false);
    setSelectedOrderId(null);
    setViewOrder(null);
    setViewOrderError(null);
  };

  const handleViewOrder = async (orderId) => {
    if (!orderId) {
      return;
    }
    setSelectedOrderId(orderId);
    setIsViewDialogOpen(true);
    setViewOrder(null);
    setViewOrderError(null);
    setViewOrderLoading(true);
    try {
      const orderDoc = await db.getDoc("HA Order", orderId, {
        fields: [
          "name",
          "customer_name",
          "table",
          "waiter",
          "order_type",
          "total_price",
          "order_items",
        ],
      });
      let waiterLabel = orderDoc.waiter || null;
      if (orderDoc.waiter) {
        try {
          const waiterDoc = await db.getDoc("HA Waiter", orderDoc.waiter, {
            fields: ["name", "waiter_name"],
          });
          waiterLabel =
            waiterDoc.waiter_name || waiterDoc.name || orderDoc.waiter;
        } catch (err) {
          console.warn("Failed to fetch waiter info:", err);
        }
      }

      let tableLabel = orderDoc.table || null;
      if (orderDoc.table) {
        try {
          const tableDoc = await db.getDoc("HA Table", orderDoc.table, {
            fields: ["name", "table_number"],
          });
          tableLabel =
            tableDoc.table_number || tableDoc.name || orderDoc.table;
        } catch (err) {
          console.warn("Failed to fetch table info:", err);
        }
      }

      setViewOrder({
        ...orderDoc,
        waiter_display: waiterLabel,
        table_display: tableLabel,
      });
    } catch (err) {
      console.error("Order view fetch error:", err);
      setViewOrderError(err?.message || "Failed to load order details.");
    } finally {
      setViewOrderLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!orderId || isDeleting) {
      return;
    }
    setIsDeleting(true);
    try {
      await db.deleteDoc("HA Order", orderId);
      toast.success("Order deleted", {
        description: `Order ID: ${orderId}`,
        duration: 4000,
      });
      closeViewDialog();
      if (id) {
        await fetchTableOrders(id);
      }
    } catch (err) {
      console.error("Order delete error:", err);
      toast.error("Unable to delete order", {
        description: err?.message || "Please try again later.",
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditOrder = async (orderId) => {
    if (!orderId) {
      return;
    }
    if (isViewDialogOpen) {
      closeViewDialog();
    }
    await loadCartFromOrder(orderId);
    startTableOrder(id, watch("waiter"), orderId, watch("customerName"));
    navigate(`/menu`);
  };

  const handleTableAction = async (event) => {
    event.preventDefault();
    if (!tableDetails?.name) {
      return;
    }

    const action = submitText(tableDetails.status);
    if (action !== "Assign Table") {
      return;
    }

    const waiter = watch("waiter");
    if (!waiter) {
      toast.error("Select a waiter before assigning the table.");
      return;
    }

    setIsTableStatusUpdating(true);
    const tableLabel = tableDetails.table_number
      ? `Table ${tableDetails.table_number}`
      : tableDetails.name;
    try {
      await db.updateDoc("HA Table", tableDetails.name, {
        status: "Occupied",
      });
      toast.success("Table marked as occupied.", {
        description: tableLabel,
        duration: 4000,
      });
      await fetchTableDetails(tableDetails.name);
    } catch (err) {
      console.error("Table status update error:", err);
      toast.error("Unable to update table status.", {
        description: err?.message || "Please try again later.",
      });
    } finally {
      setIsTableStatusUpdating(false);
    }
  };

  const dialogDescription = (() => {
    if (viewOrder) {
      const parts = [
        viewOrder.customer_name &&
          `Customer: ${viewOrder.customer_name}`,
        viewOrder.waiter_display &&
          `Waiter: ${viewOrder.waiter_display}`,
        viewOrder.table_display &&
          `Table: ${viewOrder.table_display}`,
      ].filter(Boolean);
      return parts.length ? parts.join(" • ") : "Order details";
    }
    if (viewOrderLoading) {
      return "Loading order details...";
    }
    if (viewOrderError) {
      return "Unable to load order details.";
    }
    return "Select an order to view its details.";
  })();

  if (errorTableDetails) {
    return <Error message={errorTableDetails} />;
  }

  if (loadingTableDetails) {
    return <Loader />;
  }

  return (
    <Container>
      <Toaster richColors duration={4000} position="top-center" />
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary my-4">
            {tableDetails?.table_number
              ? `Table ${tableDetails.table_number}`
              : id}
          </h1>
          {tableDetails?.status ? (
            <Badge variant={tableDetails.status.toLowerCase()}>
              {tableDetails.status}
            </Badge>
          ) : null}
        </div>
        <div className="flex gap-4">
          <div className="flex-3">
            <Card className="min-h-[80vh]">
              <CardHeader>
                <CardTitle>
                  Orders for{" "}
                  {tableDetails?.table_number
                    ? `Table ${tableDetails.table_number}`
                    : id}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="px-4" maxHeight="36rem">
                  <TableHeader>
                    <TableRow className="h-10 font-bold">
                      <TableHead className="text-xl font-bold">
                        Order No
                      </TableHead>
                      <TableHead className="text-xl font-bold text-right">
                        Status
                      </TableHead>
                      <TableHead className="text-xl font-bold text-right">
                        Value
                      </TableHead>
                      <TableHead className="text-xl font-bold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-none">
                    {tableOrdersLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          Loading orders…
                        </TableCell>
                      </TableRow>
                    ) : tableOrdersError ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-red-500"
                        >
                          <Error />
                        </TableCell>
                      </TableRow>
                    ) : tableOrders.length > 0 ? (
                      tableOrders.map((order) => (
                        <TableRow key={order.name}>
                          <TableCell>{order.name}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={order.payment_status.toLowerCase()}>
                              {order.payment_status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(order.total_price)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="secondary"
                              onClick={() => handleViewOrder(order.name)}
                            >
                              <Eye />
                              View
                            </Button>
                            <Button variant="secondary" className="ml-2 ">
                              <Printer />
                              Print
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          No unpaid orders for this table
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell></TableCell>
                      <TableCell className="font-bold text-right">
                        {formatCurrency(
                          tableOrders.reduce((sum, o) => sum + o.total_price, 0)
                        )}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-end">
                <div>
                  <Button
                    disabled={
                      tableDetails.status !== "Occupied" || loadingWaiters
                    }
                    onClick={handleNewOrder}
                  >
                    New Order
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="flex-2 h-full">
            <Card className="min-h-[80vh]">
              <CardHeader>
                <CardTitle>
                  {tableDetails?.table_number
                    ? `Table ${tableDetails.table_number} Details`
                    : id + " Details"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTableAction}>
                  <div className="flex flex-col gap-4">
                    <div className="space-y-4">
                      <Label>Customer Name</Label>
                      <Input {...register("customerName")} />
                    </div>
                    <div className="space-y-4">
                      <Label>Waiter</Label>
                      <Select
                        value={watch("waiter")}
                        onValueChange={(value) =>
                          setValue("waiter", value, { shouldValidate: true })
                        }
                        disabled={loadingWaiters}
                        readonly={tableDetails.status !== "Occupied"}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select waiter" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingWaiters && (
                            <SelectItem value="loading" disabled>
                              Loading waiters...
                            </SelectItem>
                          )}
                          {!loadingWaiters && waiters.length === 0 && (
                            <SelectItem value="no-waiters" disabled>
                              No waiters available
                            </SelectItem>
                          )}
                          {waiters.map((waiter) => (
                            <SelectItem key={waiter.name} value={waiter.name}>
                              {waiter.waiter_name || waiter.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errorWaiters && (
                        <p className="text-sm text-red-500">{errorWaiters}</p>
                      )}
                    </div>
                    <div className="space-y-4">
                      <Label>Remarks</Label>
                      <Textarea
                        {...register("remarks")}
                        className="min-h-[200px]"
                      />
                    </div>
                    <div className="space-y-4">
                      <Button
                        type="submit"
                        block
                        disabled={
                          !watch("waiter") ||
                          loadingWaiters ||
                          isTableStatusUpdating
                        }
                      >
                        {tableDetails
                          ? submitText(tableDetails.status)
                          : "Assign Table"}
                      </Button>
                      {tableDetails?.status === "Booked" && (
                        <Button className="bg-gray-300 text-black" block>
                          Cancel Booking
                        </Button>
                      )}
                      {tableDetails?.status === "Available" && (
                        <Button className="bg-gray-300 text-black" block>
                          Book Table
                        </Button>
                      )}
                      {tableDetails?.status === "Occupied" && (
                        <Button className="bg-gray-300 text-black" block>
                          Print Bill
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Dialog
        open={isViewDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeViewDialog();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedOrderId ? `Order ${selectedOrderId}` : "Order Details"}
            </DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          {viewOrderLoading ? (
            <div className="flex justify-center py-6">
              <Loader />
            </div>
          ) : viewOrderError ? (
            <p className="text-sm text-red-500">{viewOrderError}</p>
          ) : viewOrder ? (
            <div className="space-y-4">
              <div className="border rounded-md p-3 max-h-60 overflow-y-auto">
                {viewOrder.order_items && viewOrder.order_items.length > 0 ? (
                  <ul className="space-y-3">
                    {viewOrder.order_items.map((item) => (
                      <li
                        key={item.name}
                        className="flex justify-between items-start text-sm"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {item.menu_item_name || item.menu_item}
                          </span>
                          {item.preparation_remark && (
                            <span className="text-muted-foreground text-xs">
                              Note: {item.preparation_remark}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="block">
                            Qty: {item.qty ?? item.quantity ?? 0}
                          </span>
                          <span className="block">
                            {formatCurrency(item.rate ?? 0)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No items for this order.
                  </p>
                )}
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span>Total</span>
                <span>{formatCurrency(viewOrder.total_price ?? 0)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select an order to view its details.
            </p>
          )}
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => handleDeleteOrder(selectedOrderId)}
              disabled={isDeleting || !selectedOrderId}
            >
              Delete
            </Button>
            <Button
              onClick={() => handleEditOrder(selectedOrderId)}
              disabled={!selectedOrderId}
            >
              Edit Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default TableDetails;
