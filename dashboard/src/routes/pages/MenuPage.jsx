import MenuCategories from "@/components/MenuPage/MenuCategories";
import Container from "@/components/Shared/Container";
import Menu from "@/components/MenuPage/Menu";
import Cart from "@/components/MenuPage/Cart";

const MenuPage = () => {
  return (
    <Container>
      <div className="grid grid-cols-7 gap-4 relative z-0">
        <div className="col-span-5">
          <MenuCategories />
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
