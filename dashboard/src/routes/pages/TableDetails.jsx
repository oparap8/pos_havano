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
import { toast, Toaster } from "sonner";
import { db } from "@/lib/frappeClient";
import OrderDetailsDialog from "@/components/Shared/OrderDetailsDialog";

const TableDetails = () => {
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
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

  const { startTableOrder, loadCartFromOrder, clearCart } = useCartStore();

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
    clearCart();
    startTableOrder(id, watch("waiter"), null, watch("customerName"));
    navigate(`/menu`);
  };

  const handleViewOrder = (orderId) => {
    if (!orderId) {
      return;
    }
    setSelectedOrderId(orderId);
    setIsOrderDialogOpen(true);
  };

  const handleEditOrder = async (orderId) => {
    if (!orderId) {
      return;
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
                            <Badge
                              variant={
                                typeof order.payment_status === "string"
                                  ? order.payment_status.toLowerCase()
                                  : "secondary"
                              }
                            >
                              {order.payment_status || "Unknown"}
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
                        disabled={tableDetails.status === "Occupied" || loadingWaiters}
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
      <OrderDetailsDialog
        open={isOrderDialogOpen}
        orderId={selectedOrderId}
        onClose={() => {
          setIsOrderDialogOpen(false);
          setSelectedOrderId(null);
        }}
        onEdit={handleEditOrder}
        onDeleted={async () => {
          if (id) {
            await fetchTableOrders(id);
          }
          await fetchTableDetails(id);
        }}
      />
    </Container>
  );
};

export default TableDetails;
