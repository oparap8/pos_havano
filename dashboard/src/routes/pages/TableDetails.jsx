import Container from "@/components/Shared/Container";
import Error from "@/components/Error";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PenBox, Printer } from "lucide-react";
import { useWaiterStore } from "@/stores/useWaiterStore";
import { useOrderStore } from "@/stores/useOrderStore";
import { useTableStore } from "@/stores/useTableStore";
import { formatCurrency } from "@/lib/utils";

const TableDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { register, setValue, watch } = useForm({
    defaultValues: {
      guestName: "",
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

  const { tableDetails, loadingTableDetails, errorTableDetails, fetchTableDetails } =
    useTableStore();

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
      return "Close Table";
    } else if (status === "Booked") {
      return "Open Table";
    }
  };

  return (
    <Container>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary my-4">
            {tableOrders.table?.tableNumber
              ? `Table ${tableOrders.table.tableNumber}`
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
                  {tableOrders.table?.tableNumber
                    ? `Table ${tableOrders.table.tableNumber}`
                    : id}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="px-4">
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
                        <TableCell colSpan={4} className="text-center text-red-500">
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
                            {
                              formatCurrency(
                                order.total_price
                              )
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="secondary"
                              onClick={() =>
                                navigate(`/menu/?orderId=${order.name}`)
                              }
                            >
                              <PenBox />
                              Edit
                            </Button>
                            <Button
                              variant="secondary"
                              className="ml-2 "
                            >
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
                        {
                          formatCurrency(
                            tableOrders.reduce(
                              (sum, o) => sum + o.total_price,
                              0
                            )
                          )
                        }
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-end">
                <div>
                  <Button onClick={() => navigate("/menu")}>New Order</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="flex-2 h-full">
            <Card className="min-h-[80vh]">
              <CardHeader>
                <CardTitle>
                  {tableOrders.table?.tableNumber
                    ? `Table ${tableOrders.table.tableNumber} Details`
                    : `${id} Details`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="flex flex-col gap-4">
                    <div className="space-y-4">
                      <Label>Guest Name</Label>
                      <Input {...register("guestName")} />
                    </div>
                    <div className="space-y-4">
                      <Label>Waiter</Label>
                      <Select
                        value={watch("waiter")}
                        onValueChange={(value) =>
                          setValue("waiter", value, { shouldValidate: true })
                        }
                        disabled={loadingWaiters}
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
                      <Button type="submit" block>
                        {tableOrders.table &&
                          submitText(tableOrders.table.status)}
                      </Button>
                      {tableOrders.table &&
                        tableOrders.table.status === "Booked" && (
                          <Button className="bg-gray-300 text-black" block>
                            Cancel Booking
                          </Button>
                        )}
                      {tableOrders.table &&
                        tableOrders.table.status === "Available" && (
                          <Button className="bg-gray-300 text-black" block>
                            Book Table
                          </Button>
                        )}
                      {tableOrders.table &&
                        tableOrders.table.status === "Occupied" && (
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
    </Container>
  );
};

export default TableDetails;
