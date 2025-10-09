// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { getOrderListDetails } from "@/api";
// import { useEffect, useState } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import OrdersFilter from "./OrdersFilter";
// import { useNavigate } from "react-router-dom";

// const OrdersList = () => {
//   const [orders, setOrders] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const orderDetails = await getOrderListDetails();
//         console.log(orderDetails);
//         setOrders(orderDetails);
//       } catch (error) {
//         console.error("Error fetching order details:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <>
//       <TableCaption className="text-lg font-bold flex justify-between items-center">
//         <p>Orders</p>
//         <Button variant="link" onClick={() => navigate("/orders")}>View All</Button>
//       </TableCaption>
//       <OrdersFilter />
//       <Table className="px-4">
//         <TableHeader>
//           <TableRow className="h-10 font-bold">
//             <TableHead className="w-[100px] text-xl font-bold">ID</TableHead>
//             <TableHead className="text-xl font-bold">Table</TableHead>
//             <TableHead className="text-xl font-bold">Waiter</TableHead>
//             <TableHead className="text-right text-xl font-bold">
//               Status
//             </TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody className="divide-none">
//           {orders.length === 0 && <TableRow><TableCell colSpan={4} className="text-center">No orders found</TableCell></TableRow>}
//            {orders.map((order) => (
//             <TableRow key={order.id} className="h-10">
//               <TableCell className="font-medium">{order.id}</TableCell>
//               <TableCell>{order.tableNumber}</TableCell>
//               <TableCell>{order.employeeName}</TableCell>
//               <TableCell className={`text-right`}>
//                 <Badge variant={order.status.toLowerCase()}>
//                   {order.status}
//                 </Badge>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </>
//   );
// };

// export default OrdersList;


import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrderListDetails } from "@/api";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import OrdersFilter from "./OrdersFilter";
import { useNavigate } from "react-router-dom";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    employee: "",
    table: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderDetails = await getOrderListDetails();
        setOrders(orderDetails);
        setFilteredOrders(orderDetails);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    fetchData();
  }, []);

  // Apply filters whenever filters or orders change
  useEffect(() => {
    let filtered = orders;
    console.log(filters);
    console.log(orders);

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
          <Button variant="link" onClick={() => setFilters({status: "", employee: "", table: ""})}>
            Clear Filters
          </Button>
          <Button variant="link" onClick={() => navigate("/orders")}>
            View All
          </Button>
        </div>
      </TableCaption>

      {/* Pass filters + setter to child */}
      <OrdersFilter filters={filters} setFilters={setFilters} />

      <Table className="px-4">
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
            <TableRow key={order.id} className="h-10">
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.tableNumber}</TableCell>
              <TableCell>{order.employeeName}</TableCell>
              <TableCell className="text-right">
                <Badge variant={order.status.toLowerCase()}>
                  {order.status}
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
