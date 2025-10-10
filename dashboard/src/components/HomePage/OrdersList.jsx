import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrderStore } from "@/stores/useOrderStore";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import OrdersFilter from "./OrdersFilter";
import { useNavigate } from "react-router-dom";

const OrdersList = () => {
  const { orders, loading: orderLoading, error: orderError, fetchOrders } = useOrderStore();

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    employee: "",
    table: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    setFilteredOrders(orders.filter((o) => o.payment_status == "Unpaid"));
  }, []);

  // Apply filters whenever filters or orders change
  useEffect(() => {
    let filtered = orders.filter((o) => o.payment_status == "Unpaid");

    if (filters.status) {
      filtered = filtered.filter(
        (o) => o.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.employee) {
      filtered = filtered.filter(
        (o) => String(o.employeeName) === String(filters.employee)
      );
    }

    if (filters.table) {
      filtered = filtered.filter(
        (o) => String(o.tableNumber) === String(filters.table)
      );
    }

    setFilteredOrders(filtered);
  }, [filters, orders]);

  return (
    <>
      <TableCaption className="text-lg font-bold flex justify-between items-center">
        <p>Orders</p>
        <div>
          <Button
            variant="link"
            onClick={() => setFilters({ status: "", employee: "", table: "" })}
          >
            Clear Filters
          </Button>
          <Button variant="link" onClick={() => navigate("/orders")}>
            View All
          </Button>
        </div>
      </TableCaption>

      {/* Pass filters + setter to child */}
      <OrdersFilter filters={filters} setFilters={setFilters} />

      <Table className="px-4" maxHeight="25rem">
        <TableHeader>
          <TableRow className="h-10 font-bold">
            <TableHead className="w-[100px] text-xl font-bold">ID</TableHead>
            <TableHead className="text-xl font-bold">Table</TableHead>
            <TableHead className="text-xl font-bold">Waiter</TableHead>
            <TableHead className="text-right text-xl font-bold">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-none">
          {filteredOrders.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No orders found
              </TableCell>
            </TableRow>
          )}
          {filteredOrders.map((order) => (
            <TableRow key={order.name} className="h-10">
              <TableCell className="font-medium">{order.name}</TableCell>
              <TableCell>{
              order.table_number? `Table ${order.table_number}` : "Unassigned"
              }</TableCell>
              <TableCell>{
              order.waiter_name? order.waiter_name : "Unassigned"
              }</TableCell>
              <TableCell className="text-right">
                <Badge >
                  {order.payment_status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default OrdersList;
