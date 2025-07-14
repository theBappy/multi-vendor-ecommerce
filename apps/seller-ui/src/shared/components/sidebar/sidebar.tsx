"use client";

import useSeller from "apps/seller-ui/src/hooks/useSeller";
import useSidebar from "apps/seller-ui/src/hooks/useSidebar";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

import { Box } from "./box";
import { Sidebar } from "./sidebar-styles";
import {
  Store,
  LayoutDashboard,
  ListOrdered,
  CreditCard,
  SquarePlus,
  PackageSearch,
  CalendarPlus,
  BellPlus,
  Mail,
  Settings,
  BellRing,
  TicketPercent,
  LogOut,
} from "lucide-react";
import SidebarItem from "./sidebar-item";
import SidebarMenu from "./sidebar-menu";

const SidebarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathname = usePathname();
  const { seller } = useSeller();

  useEffect(() => {
    setActiveSidebar(pathname);
  }, [pathname, setActiveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? "#0085ff" : "#969696";

  return (
    <Box
      css={{
        height: "100vh",
        zIndex: 202,
        position: "sticky",
        padding: "8px",
        top: "0",
        overflowY: "scroll",
        scrollbarWidth: "none",
        msOverflowStyle: "none", 
        "&::-webkit-scrollbar": {
          display: "none", 
        },
      }}
      className="sidebar-wrapper"
    >
      {/* Sidebar Header */}
      <Sidebar.Header>
        <Link href="/" className="flex items-start text-center gap-2">
          <Store />
          <Box>
            <h3 className="text-xl font-medium text-[#ecedee]">
              {seller?.shop?.name}
            </h3>
            <h5 className="font-medium text-xs text-[#ecedeecf] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px] pl-2">
              {seller?.shop?.address}
            </h5>
          </Box>
        </Link>
      </Sidebar.Header>

      {/* Sidebar Body */}
      <div className="block -mt-8 my-3 h-full">
        <Sidebar.Body className="sidebar-body">
          {/* Dashboard */}
          <SidebarItem
            title="Dashboard"
            icon={
              <LayoutDashboard size={20} color={getIconColor("/dashboard")} />
            }
            isActive={activeSidebar === "/dashboard"}
            href="/dashboard"
          />

          {/* Orders & Payments */}
          <div className="-mt-4">
            <SidebarMenu title="Main Menu">
              <SidebarItem
                title="Orders"
                icon={
                  <ListOrdered
                    size={20}
                    color={getIconColor("/dashboard/orders")}
                  />
                }
                isActive={activeSidebar === "/dashboard/orders"}
                href="/dashboard/orders"
              />
              <SidebarItem
                title="Payments"
                icon={
                  <CreditCard
                    size={20}
                    color={getIconColor("/dashboard/payments")}
                  />
                }
                isActive={activeSidebar === "/dashboard/payments"}
                href="/dashboard/payments"
              />
            </SidebarMenu>
            <SidebarMenu title="Products">
              <SidebarItem
                title="Products"
                icon={
                  <SquarePlus
                    size={20}
                    color={getIconColor("/dashboard/create-product")}
                  />
                }
                isActive={activeSidebar === "/dashboard/create-product"}
                href="/dashboard/create-product"
              />
              <SidebarItem
                title="All Products"
                icon={
                  <PackageSearch
                    size={20}
                    color={getIconColor("/dashboard/all-products")}
                  />
                }
                isActive={activeSidebar === "/dashboard/all-products"}
                href="/dashboard/all-products"
              />
            </SidebarMenu>
            <SidebarMenu title="Events">
              <SidebarItem
                title="Create Event"
                icon={
                  <CalendarPlus
                    size={20}
                    color={getIconColor("/dashboard/create-event")}
                  />
                }
                isActive={activeSidebar === "/dashboard/create-event"}
                href="/dashboard/create-event"
              />
              <SidebarItem
                title="All Events"
                icon={
                  <BellPlus
                    size={20}
                    color={getIconColor("/dashboard/all-events")}
                  />
                }
                isActive={activeSidebar === "/dashboard/all-events"}
                href="/dashboard/all-events"
              />
            </SidebarMenu>
            <SidebarMenu title="Controllers">
                <SidebarItem
                title="Inbox"
                icon={
                  <Mail
                    size={20}
                    color={getIconColor("/dashboard/inbox")}
                  />
                }
                isActive={activeSidebar === "/dashboard/inbox"}
                href="/dashboard/inbox"
              />
                <SidebarItem
                title="Settings"
                icon={
                  <Settings
                    size={20}
                    color={getIconColor("/dashboard/settings")}
                  />
                }
                isActive={activeSidebar === "/dashboard/settings"}
                href="/dashboard/settings"
              />
                <SidebarItem
                title="Notifications"
                icon={
                  <BellRing
                    size={20}
                    color={getIconColor("/dashboard/notifications")}
                  />
                }
                isActive={activeSidebar === "/dashboard/notifications"}
                href="/dashboard/notifications"
              />
            </SidebarMenu>
            <SidebarMenu title="Extras">
                <SidebarItem
                title="Discount"
                icon={
                  <TicketPercent
                    size={20}
                    color={getIconColor("/dashboard/discount-codes")}
                  />
                }
                isActive={activeSidebar === "/dashboard/discount-codes"}
                href="/dashboard/discount-codes"
              />
                <SidebarItem
                title="Logout"
                icon={
                  <LogOut
                    size={20}
                    color={getIconColor("/logout")}
                  />
                }
                href="/"
              />
            </SidebarMenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SidebarWrapper;
