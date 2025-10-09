import Container from "@/components/Shared/Container";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { getOrdersForTable } from "@/api";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PenBox, Printer } from "lucide-react";


const TableDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tableOrders, setTableOrders] = useState({
    table: null,
    orders: [],
    grandTotal: 0,
  });
  const { register, handleSubmit, formState: { values } } = useForm({
    guestName: "",
    waiter: "",
    remarks: "",
  });

  useEffect(() => {
    const fetchTableOrders = async () => {
      try {
        const ordersT = await getOrdersForTable(id);
        console.log("Orders for table:", ordersT);
        setTableOrders(ordersT);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTableOrders();
  }, [id]);

  const submitText = (status) => {
    if (status === "Available") {
      return "Assign Table";
    } else if (status === "Occupied") {
      return "Close Table";
    } else if (status === "Booked") {
      return "Open Table";
    }
  }

  return (
    <Container>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary my-4">Table {id}</h1>
          {tableOrders.table && (
            <Badge variant={tableOrders.table.status.toLowerCase()}>
              {tableOrders.table.status}
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3 h-full">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Orders for Table {id}</CardTitle>
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
                    {tableOrders.orders.length > 0 ? (
                      tableOrders.orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={order.status.toLowerCase()}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            ${order.totalAmount}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="secondary"
                              onClick={() =>
                                navigate(`/menu/?orderId=${order.id}`)
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
                        <TableCell colSpan={3} className="text-center">
                          No orders for this table
                        </TableCell>
                      </TableRow>
                    )}
                    {/* Footer row for grand total */}
                    <TableRow>
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell></TableCell>
                      <TableCell className="font-bold text-right">
                        ${tableOrders.grandTotal}
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
          <div className="col-span-2 h-full">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Table {id} Details</CardTitle>
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
                      <Select {...register("waiter")}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select waiter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="waiter1">Waiter 1</SelectItem>
                          <SelectItem value="waiter2">Waiter 2</SelectItem>
                          <SelectItem value="waiter3">Waiter 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <Label>Remarks</Label>
                      <Textarea {...register("remarks")} />
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
                      {/* <Button className="bg-gray-300 text-black" block>
                        Reprint KOT
                      </Button> */}
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
