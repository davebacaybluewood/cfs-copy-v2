import AboutUs from "pages/AboutUs/AboutUs";
import BlogPage from "pages/BlogPage/BlogPage";
import BusinessProtection from "pages/BusinessProtection/BusinessProtection";
import ContactPage from "pages/ContactPage/ContactPage";
import FamilyProtection from "pages/FamilyProtection/FamilyProtection";
import Home from "pages/Home/Home";
import Solutions from "pages/Solutions/Solutions";
import { RouteProps } from "react-router-dom";

type ReactRoutesType = RouteProps & {
  showFooter?: boolean;
  showNavbar?: boolean;
  showHeadline?: boolean;
  theme?: "SKY" | "RED" | "NAVY";
};

const paths = {
  index: "/",
  home: "/home",
  family_protection: "/family-protection",
  business_protection: "/business-protection",
  contact_us: "/contact_us",
  about_us: "/about-us",
  solutions: "/solutions",
  resources: "/blogs_and_resources",
};

const REACT_ROUTES: ReactRoutesType[] = [
  {
    element: <Home key="main-index" />,
    path: paths.index,
  },
  {
    element: <Home key="index" />,
    path: paths.home,
  },
  {
    element: <FamilyProtection />,
    path: paths.family_protection,
  },
  {
    element: <BusinessProtection />,
    path: paths.business_protection,
    showHeadline: false,
    theme: "SKY",
  },
  {
    element: <BlogPage />,
    path: paths.resources,
  },
  {
    element: <AboutUs />,
    path: paths.about_us,
  },
  {
    element: <Solutions />,
    path: paths.solutions,
  },
  {
    element: <ContactPage />,
    path: paths.contact_us,
  },
  {
    element: <p>Not found</p>,
    path: "*",
  },
];

export { paths, REACT_ROUTES };
