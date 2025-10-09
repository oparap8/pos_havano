import { useContext, useState, useEffect } from "react";
import { MenuCartContext } from "@/routes/pages/MenuPage";
import MenuItemCard from "@/components/MenuPage/MenuItemCard";
import { getMenuItems } from "@/api";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import NumPad from "./UpdateCartDialog";

const Menu = () => {
  const { selectedCategory } = useContext(MenuCartContext);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!selectedCategory?.id) return;

      const items = await getMenuItems(selectedCategory.id);
      setMenuItems(items);
    };

    fetchMenuItems();
  }, [selectedCategory]);

  return (
    <>
      <NumPad isOpen={false} setIsOpen={() => {}} />
      <div className="flex items-center justify-between">
        <p className="text-2xl my-4">{selectedCategory.name}</p>
        <div className="flex items-center w-1/3 bg-background px-2 py-1 rounded-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
          <input
            type="text"
            placeholder="Search"
            className="w-full focus:outline-none focus:ring-0 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="text-primary" />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {menuItems
          .filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
      </div>
    </>
  );
};

export default Menu;
