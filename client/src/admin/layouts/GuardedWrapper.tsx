import adminPathsNew from "admin/constants/routes";
import UserProvider, { UserContext } from "admin/context/UserProvider";
import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AdminSidebar from "./Sidebar/Sidebar";
import UpgradeToPro from "admin/components/UpgradeToPro/UpgradeToPro";
import useUserRole from "hooks/useUserRole";

type GuardedWrapperProps = {
  children: React.ReactNode;
};
const GuardedWrapper: React.FC<GuardedWrapperProps> = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      // Check if the screen width is below a certain threshold (e.g., 768 pixels)
      const isMobile = window.innerWidth < 768

      // Update the state based on the mobile condition
      setCollapsed(isMobile)
    }

    // Initial check on component mount
    handleResize()

    // Attach event listener for window resize
    window.addEventListener("resize", handleResize)

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    const isAuthenticated =
      "token" in JSON.parse(localStorage.getItem("userInfo") ?? "{}");

    if (!isAuthenticated) {
      navigate(adminPathsNew.login);
    }
  }, []);

  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
  };

  const handleToggleSidebar = (value: any) => {
    setToggled(value);
  };

  const adminClassnames = classNames({
    "admin-wrapper": true,
    toggled: toggled,
  });

  return (
    <UserProvider>
      {/* <LogoutOnClose /> */}
      <div className={adminClassnames}>
        <AdminSidebar
          collapsed={collapsed}
          toggled={toggled}
          handleToggleSidebar={handleToggleSidebar}
          handleCollapsedChange={handleCollapsedChange}
        />
        <main>{props.children}</main>
      </div>
      <ToastContainer />
      <UpgradeToPro />
    </UserProvider>
  );
};

export default GuardedWrapper;
