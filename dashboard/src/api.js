import axios from "axios";

// Create an Axios instance with the base URL
const api = axios.create({
	baseURL: "http://localhost:3000", // JSON Server URL
	headers: {
		"Content-Type": "application/json",
	},
});

// ----------------- MENU -----------------

// ----------------- MENU -----------------

export const getMenuCategories = async () => {
  const { data: categories } = await api.get("/menuCategories");
  const { data: menuItems } = await api.get("/menuItems");

  // Count items per category
  const categoryWithCounts = categories.map((cat) => {
    const count = menuItems.filter((item) => item.categoryId === cat.id).length;
    return { ...cat, itemCount: count };
  });

  // Add the "All" category
  const allCategory = {
    id: "all",
    name: "All",
    itemCount: menuItems.length,
  };

  return [allCategory, ...categoryWithCounts];
};


export const getMenuItems = async (categoryId) => {
	const params = {};

	// Add categoryId to params if it's not "All" or null
	if (categoryId && categoryId !== "all") {
		params.categoryId = categoryId;
	}

	const { data } = await api.get("/menuItems", { params });
	return data;
};

// ----------------- EMPLOYEES -----------------

export const getEmployees = async (employeeId) => {
	if (employeeId) {
		const { data } = await api.get("/employees", { params: { id: employeeId } });
		return data[0] || null;
	}
	const { data } = await api.get("/employees");
	return data;
};

// ----------------- TABLES -----------------

export const getTables = async (tableId) => {
	if (tableId) {
		const { data } = await api.get("/diningTables", { params: { id: tableId } });
		return data[0] || null;
	}
	const { data } = await api.get("/diningTables");
	return data;
};

// ----------------- ORDERS -----------------

export const getOrders = async () => {
	const { data } = await api.get("/orders");
	return data;
};

export const getOrderItems = async (orderId) => {
	const { data } = await api.get("/orderItems", { params: { orderId } });
	return data;
};

// 🔑 Get summarized order details: tableNumber, status, employeeName, orderDateTime, itemCount, totalAmount
export const getOrderListDetails = async () => {
	try {
		const orders = await getOrders();

		const orderDetails = await Promise.all(
			orders.map(async (order) => {
				const employee = await getEmployees(order.employeeId);
				const table = await getTables(order.tableId);
				const items = await getOrderItems(order.id);

				// compute number of items and total (fallback in case order.totalAmount is missing)
				const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
				const computedTotal = items.reduce((sum, item) => sum + item.price, 0);

				return {
					id: order.id,
					tableNumber: table ? table.tableNumber : "Unknown",
					status: order.status,
					employeeName: employee ? employee.name : "Unassigned",
					orderDateTime: order.orderDateTime,
					itemCount,
					totalAmount: order.totalAmount ?? computedTotal,
				};
			})
		);

		return orderDetails;
	} catch (error) {
		console.error("Error fetching order details:", error);
		throw error;
	}
};

// ----------------- ORDERS BY TABLE -----------------

export const getOrdersForTable = async (tableId) => {
	try {
		const orders = await getOrders();
		const table = await getTables(tableId); // fetch the table itself

		const filteredOrders = orders.filter((order) => order.tableId === Number(tableId));

		const ordersWithTotal = await Promise.all(
			filteredOrders.map(async (order) => {
				const items = await getOrderItems(order.id);
				const computedTotal = items.reduce((sum, item) => sum + item.price, 0);

				return {
					...order,
					totalAmount: order.totalAmount ?? computedTotal,
				};
			})
		);

		const grandTotal = ordersWithTotal.reduce((sum, o) => sum + o.totalAmount, 0);

		return {
			table: table
				? { id: table.id, tableNumber: table.tableNumber, status: table.status }
				: null,
			orders: ordersWithTotal,
			grandTotal,
		};
	} catch (error) {
		console.error("Error fetching orders for table:", error);
		throw error;
	}
};


// ----------------- ORDER ITEMS WITH NAMES -----------------

export const getOrderItemsWithNames = async (orderId) => {
  try {
    // Fetch order items for the given order
    const orderItems = await getOrderItems(orderId);
	console.log('orderItems',orderItems);
    // Fetch all menu items to map names
    const menuItems = await getMenuItems();
	console.log('menuItems',menuItems);	

    // Map each order item to include name
    const itemsWithNames = orderItems.map((item) => {
      const menuItem = menuItems.find((menu) => Number(menu.id) === item.menuItemId);
      return {
		id: menuItem ? menuItem.id : "Unknown",
        name: menuItem ? menuItem.name : "Unknown",
        quantity: item.quantity,
        price: item.price,
      };
    });

    return itemsWithNames;
  } catch (error) {
    console.error("Error fetching order items with names:", error);
    throw error;
  }
};





export const createOrder = (orderData) => api.post("/orders", orderData);

// ----------------- PAYMENTS -----------------

export const createPayment = (paymentData) => api.post("/payments", paymentData);

export default api;
