import Cart from "@/components/MenuPage/Cart";
import Menu from "@/components/MenuPage/Menu";
import MenuCategories from "@/components/MenuPage/MenuCategories";
import Container from "@/components/Shared/Container";

const MenuPage = () => {
  return (
    <Container>
      <div className="grid grid-cols-7 gap-4 relative z-0">
        <div className="col-span-5">
          <div className="flex items-center gap-4">
            <MenuCategories />
            <p>test</p>
          </div>
          <Menu />
        </div>
        <div className="col-span-2">
          <Cart />
        </div>
      </div>
    </Container>
  );
};

export default MenuPage;
