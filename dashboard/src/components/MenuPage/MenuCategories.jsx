import { useEffect, useState } from "react";
import { getBgColor } from "@/utils";
import { getMenuCategories } from "@/api";
import { useContext } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { ChevronsRight } from "lucide-react";
import { MenuCartContext } from "@/routes/pages/MenuPage";

const MenuCategories = () => {
  const [menuCategories, setMenuCategories] = useState([]);
  const [categoryColors, setCategoryColors] = useState({});
  const { selectedCategory, setSelectedCategory } = useContext(MenuCartContext);

  useEffect(() => {
    const fetchMenuCategories = async () => {
      let categories = await getMenuCategories();
      console.log(categories);
      const category = { id: categories[0].id, name: categories[0].name };

      // set directly
      setSelectedCategory(category);
      console.log("Selected category:", selectedCategory);

      // Generate a color for each category once
      const colors = {};
      categories.forEach((category) => {
        colors[category.id] = getBgColor();
      });

      setMenuCategories(categories);
      setCategoryColors(colors);
    };

    fetchMenuCategories();
  }, []);

  return (
    <>
      <Drawer>
        <DrawerTrigger className="flex gap-2 items-center text-secondary text-lg pb-[2px] hover:pb-0 hover:border-b-2 hover:border-secondary cursor-pointer">
          View Categories
          <ChevronsRight />
        </DrawerTrigger>
        <DrawerContent side="left">
          <DrawerHeader>
            <DrawerTitle>Menu Categories</DrawerTitle>
            <DrawerDescription>Select a category</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 mt-2 overflow-y-auto scrollbar-hide">
            <div className="grid grid-cols-1 gap-4">
              {menuCategories.map((category) => (
                <div
                  key={category.id}
                  style={{ backgroundColor: categoryColors[category.id] }}
                  className={`flex flex-col p-4 rounded-lg h-[100px] cursor-pointer ${
                    selectedCategory.id === category.id
                      ? "ring-2 ring-white"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedCategory({
                      id: category.id,
                      name: category.name,
                    })
                  }
                >
                  <div className="flex justify-between items-center gap-2">
                    <h1 className="text-2xl text-white font-bold">{category.name}</h1>
                    {selectedCategory.id === category.id && (
                      <div className="border-2 border-white p-1 rounded-full">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-200 mt-4">
                      {category.itemCount} items
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MenuCategories;
