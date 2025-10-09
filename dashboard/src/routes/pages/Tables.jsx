import Container from "@/components/Shared/Container";
import { getTables } from "@/api";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getBgColor } from "@/utils";

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchTables = async () => {
      const tables = await getTables();
      setTables(tables);
    };
    fetchTables();
  }, []);
  return (
    <>
      <Container>
        <div className="flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-primary">Tables</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => setFilter("All")}
              variant={filter === "All" ? "secondary" : "outline"}
            >
              All
            </Button>
            <Button
              onClick={() => setFilter("Available")}
              variant={filter === "Available" ? "secondary" : "outline"}
            >
              Available
            </Button>
            <Button
              onClick={() => setFilter("Occupied")}
              variant={filter === "Occupied" ? "secondary" : "outline"}
            >
              Occupied
            </Button>
            <Button
              onClick={() => setFilter("Booked")}
              variant={filter === "Booked" ? "secondary" : "outline"}
            >
              Booked
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-4">
          {tables
            .filter((table) => filter === "All" || table.status === filter)
            .map((table) => (
              <Link key={table.id} to={`/tables/${table.id}`}>
                <Card className="cursor-pointer">
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle>{table.tableNumber}</CardTitle>
                    <Badge variant={table.status.toLowerCase()}>
                      {table.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center mb-4">
                      <div
                        className="flex items-center rounded-full p-4"
                        style={{ backgroundColor: getBgColor() }}
                      >
                        <Utensils size={24} className="text-white" />
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Capacity: {table.capacity}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </Container>
    </>
  );
};

export default Tables;
