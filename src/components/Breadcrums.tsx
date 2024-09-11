import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="text-sm text-muted-foreground">
      <ul className="flex space-x-2">
        <li>
          {pathnames.length > 0 && <span> </span>}
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return isLast ? (
            <li key={to} className="text-muted-foreground">
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </li>
          ) : (
            <li key={to}>
              <Link to={to} className="hover:text-primary">
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Link>
              <span> / </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
