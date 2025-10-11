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
import { formatCurrency } from "@/lib/utils";

const Home = () => {
  const navigate = useNavigate();
  const {
    menuItems,
    fetchMenuItems,
    loading: menuLoading,
    error: menuError,
  } = useMenuStore();


  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <div className="bg-secondary-background">
      <Container>
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h1 className="text-xl font-bold">Hello, Havano</h1>
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
                onClick={() => navigate("/menu")}
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
                  {menuItems.slice(0, 10).map((item, index) => (
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
                          {/* <p className="text-xs text-gray-500">
                              Orders: {item.orders}
                            </p> */}
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
