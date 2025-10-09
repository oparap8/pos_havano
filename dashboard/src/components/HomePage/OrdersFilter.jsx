// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Form } from "react-router-dom";
// import { getEmployees, getTables } from "@/api";
// import { useState, useEffect } from "react";

// const OrdersFilter = () => {
//   const [employees, setEmployees] = useState([]);
//   const [tables, setTables] = useState([]);
//   const [formData, setFormData] = useState({
//     status: "",
//     employee: "",
//     table: "",
//   });

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       const employees = await getEmployees();
//       setEmployees(employees);
//     };

//     const fetchTables = async () => {
//       const tables = await getTables();
//       console.log("Fetched tables:", tables);
//       setTables(tables);
//     };

//     fetchTables();
//     fetchEmployees();
//   }, []);

//   return (
//     <Form className="grid grid-cols-3 gap-4">
//       <div className="space-y-2 w-full">
//         <p>Table</p>
//         <Select
//           value={formData.table}
//           onValueChange={(value) => setFormData({ ...formData, table: value })}
//         >
//           <SelectTrigger className="bg-secondary-background w-full">
//             <SelectValue placeholder="Filter by Table" />
//           </SelectTrigger>
//           <SelectContent>
//             {tables.map((table) => (
//               <SelectItem key={table.id} value={table.id}>
//                 {table.tableNumber}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="space-y-2 w-full">
//         <p>Waiter</p>
//         <Select
//           value={formData.employee}
//           onValueChange={(value) =>
//             setFormData({ ...formData, employee: value })
//           }
//         >
//           <SelectTrigger className="bg-secondary-background w-full">
//             <SelectValue placeholder="Filter by Waiter" />
//           </SelectTrigger>
//           <SelectContent>
//             {employees.map((employee) => (
//               <SelectItem key={employee.id} value={employee.id}>
//                 {employee.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="space-y-2 w-full">
//         <p>Status</p>
//         <Select
//           value={formData.status}
//           onValueChange={(value) => setFormData({ ...formData, status: value })}
//         >
//           <SelectTrigger className="bg-secondary-background w-full">
//             <SelectValue placeholder="Filter by Status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="pending">Pending</SelectItem>
//             <SelectItem value="served">Served</SelectItem>
//             <SelectItem value="paid">Paid</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//     </Form>
//   );
// };

// export default OrdersFilter;

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEmployees, getTables } from "@/api";
import { useState, useEffect } from "react";

const OrdersFilter = ({ filters, setFilters }) => {
  const [employees, setEmployees] = useState([]);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [tablesData, employeesData] = await Promise.all([
        getTables(),
        getEmployees(),
      ]);
      setTables(tablesData);
      setEmployees(employeesData);
    };
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      {/* Table filter */}
      <div className="space-y-2 w-full">
        <p>Table</p>
        <Select
          value={filters.table}
          onValueChange={(value) => setFilters({ ...filters, table: value })}
        >
          <SelectTrigger className="bg-secondary-background w-full">
            <SelectValue placeholder="Filter by Table" />
          </SelectTrigger>
          <SelectContent>
            {tables.map((table) => (
              <SelectItem key={table.id} value={String(table.tableNumber)}>
                {table.tableNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Waiter filter */}
      <div className="space-y-2 w-full">
        <p>Waiter</p>
        <Select
          value={filters.employee}
          onValueChange={(value) => setFilters({ ...filters, employee: value })}
        >
          <SelectTrigger className="bg-secondary-background w-full">
            <SelectValue placeholder="Filter by Waiter" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={String(employee.name)}>
                {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status filter */}
      <div className="space-y-2 w-full">
        <p>Status</p>
        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger className="bg-secondary-background w-full">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="served">Served</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OrdersFilter;
