import Clock from "@/components/HomePage/Clock";
import Container from "@/components/Shared/Container";
import OrdersList from "@/components/HomePage/OrdersList";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMenuStore } from "@/stores/useMenuStore";
import { useEffect, useState } from "react";
import {
  formatCurrency,
  getCurrentUserFullName,
  getNumberOfOrders,
} from "@/lib/utils";
import { useCartStore } from "@/stores/useCartStore";

const Home = () => {
  const navigate = useNavigate();
  const { startNewTakeAwayOrder } = useCartStore();
  const {
    menuItems,
    fetchMenuItems,
    loading: menuLoading,
    error: menuError,
  } = useMenuStore();
  const [userName, setUserName] = useState(null);
  const [popularItems, setPopularItems] = useState([]);


  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const loadUserName = async () => {
      try {
        const name = await getCurrentUserFullName();
        if (name) {
          setUserName(name);
        }
      } catch (err) {
        console.error("Failed to load user name:", err);
      }
    };

    loadUserName();
  }, []);

  useEffect(() => {
    if (!menuItems || menuItems.length === 0) {
      setPopularItems([]);
      return;
    }

    let isCancelled = false;

    const loadPopularItems = async () => {
      try {
        const entries = await Promise.all(
          menuItems.map(async (item) => {
            try {
              const count = await getNumberOfOrders(item.name);
              return { ...item, orderCount: count };
            } catch (err) {
              console.error("Failed to fetch order count:", err);
              return { ...item, orderCount: 0 };
            }
          })
        );

        const sorted = entries.sort(
          (a, b) => (b.orderCount ?? 0) - (a.orderCount ?? 0)
        );

        if (!isCancelled) {
          setPopularItems(sorted.slice(0, 10));
        }
      } catch (err) {
        console.error("Failed to load order counts:", err);
      }
    };

    loadPopularItems();

    return () => {
      isCancelled = true;
    };
  }, [menuItems]);

  return (
    <div className="bg-secondary-background">
      <Container>
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h1 className="text-xl font-bold">Hello, {userName || "Havano"}</h1>
                <p className="text-xs text-gray-500">
                  Give your customers the best service
                </p>
              </div>
              <div>
                <Clock />
              </div>
            </div>
            <div className="flex items-center gap-4 py-8">
              <Button size="lg" onClick={() => navigate("/tables")}>
                DINE IN
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  startNewTakeAwayOrder();
                  navigate("/menu")}}
                className="border-primary/30 shadow-sm hover:shadow-md"
              >
                TAKE AWAY
              </Button>
            </div>
            <div className="space-y-4">
              <Card className="px-4 h-[65vh]">
                <CardContent>
                  <OrdersList />
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="col-span-2">
            <Card className="px-4 h-full">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Popular Menu Items</CardTitle>
                <CardAction>
                  <Button variant="link" onClick={() => navigate("/menu")}>
                    View All
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {popularItems.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between bg-secondary-background rounded-md py-2 px-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center">
                          <p className="text-lg font-bold text-white">
                            {index + 1}
                          </p>
                        </div>
                        <div>
                          <p>{item.item_name}</p>
                          <p className="text-xs text-gray-500">
                            Orders: {item.orderCount ?? 0}
                          </p>
                        </div>
                      </div>
                      <p>{formatCurrency(item.standard_rate)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Home;
