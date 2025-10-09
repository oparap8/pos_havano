import navLinks from "@/navLinks";
import { NavLink } from "react-router-dom";
import Container from "@/components/Shared/Container";

const Footer = () => {
  return (
    <>
      <div>
        <hr className="border border-primary" />
        <Container>
          <div className="py-4">
            <div className="flex items-center justify-between">
              {navLinks.map((link) => (
                <NavLink
                  to={link.path}
                  key={link.name}
                  end
                  className={({ isActive }) =>
                    isActive
                      ? "text-secondary font-bold border-y-2 border-secondary"
                      : "text-secondary hover:border-y-2 hover:border-secondary"
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Footer;
