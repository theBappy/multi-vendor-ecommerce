"use client";

import useUser from "apps/user-ui/src/hooks/useUser";
import {
  Bell,
  CheckCircle,
  Clock,
  Inbox,
  Loader2,
  Lock,
  MapPin,
  ShoppingBag,
  Truck,
  User,
  LogOut,
  Pencil,
  Gift,
  BadgeCheck,
  Settings,
  Receipt,
  PhoneCall
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "apps/user-ui/src/utils/axiosInstance";
import Image from 'next/image'
import { StatCard } from "apps/user-ui/src/shared/components/cards/stat-card";
import { QuickActionCard } from "apps/user-ui/src/shared/components/cards/quick-action-card";
import { ShippingAddressSection } from "apps/user-ui/src/shared/components/cards/shipping-address-section";

const UserProfilePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { user, isLoading } = useUser();
  console.log({user})

  const queryTab = searchParams.get("active") || "Profile";
  const [activeTab, setActiveTab] = useState(queryTab);

  useEffect(() => {
    if (activeTab !== queryTab) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("active", activeTab);
      router.replace(`/profile?${newParams.toString()}`);
    }
  }, [activeTab]);


  const logoutHandler = async() => {
    await axiosInstance.get('/api/logout-user').then((res) => {
      queryClient.invalidateQueries({queryKey: ['user']})
      router.push('/login')
    })
  };

  return (
    <div className="bg-gray-50 p-6 bp-14">
      <div className="md:max-w-7xl mx-auto">
        {/* greetings */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back,{" "}
            <span className="text-blue-600">
              {isLoading ? (
                <Loader2 className="inline animate-spin w-5 h-5" />
              ) : (
                `${user?.name || "User"}`
              )}
            </span>{" "}
            👋
          </h1>
        </div>

        {/* profile overview grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <StatCard title="Total Orders" count={10} Icon={Clock} />
          <StatCard title="Processing Orders" count={4} Icon={Truck} />
          <StatCard title="Completed Orders" count={5} Icon={CheckCircle} />
        </div>

        {/* sidebar and content layout */}
        <div className="mt-10 flex flex-col md:flex-row gap-6">
          {/* left navigation */}
          <div className="bg-white p-4 rounded-md border shadow-sm border-gray-100 w-full md:w-1/5">
            <nav className="space-y-2">
              <NavItems
                label="Profile"
                Icon={User}
                active={activeTab === "Profile"}
                onClick={() => setActiveTab("Profile")}
              />
              <NavItems
                label="My Orders"
                Icon={ShoppingBag}
                active={activeTab === "My Orders"}
                onClick={() => setActiveTab("My Orders")}
              />
              <NavItems
                label="Inbox"
                Icon={Inbox}
                active={activeTab === "Inbox"}
                onClick={() => router.push("/inbox")}
              />
              <NavItems
                label="Notifications"
                Icon={Bell}
                active={activeTab === "Notifications"}
                onClick={() => setActiveTab("Notifications")}
              />
              <NavItems
                label="Shipping Address"
                Icon={MapPin}
                active={activeTab === "Shipping Address"}
                onClick={() => setActiveTab("Shipping Address")}
              />
              <NavItems
                label="Change Password"
                Icon={Lock}
                active={activeTab === "Change Password"}
                onClick={() => setActiveTab("Change Password")}
              />
              <NavItems
                label="Logout"
                Icon={LogOut}
                danger
                onClick={()=>logoutHandler()}
              />
            </nav>
          </div>
          {/* main content */}
          <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 w-full md:w-[55%]">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {activeTab}
            </h2>
            {activeTab === 'Profile' && !isLoading && user ? (
              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                <Image className="w-16 h-16 rounded-full border border-gray-200" width={60} height={60} src={user?.avatar || "https://avatar.iran.liara.run/public/13"} alt="user-image" />
                <button className="flex items-center gap-1 text-blue-500 text-xs font-medium">
                <Pencil className="w-4 h-4" />Change Photo
                </button>
                </div>
                <p>
                  <span className="font-semibold">Name:</span>{user.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{user.email}
                </p>
                <p>
                  <span className="font-semibold">Joined:</span>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Earned Points:</span>{" "}
                  {user.points || 0}
                </p>
              </div>
            ): activeTab === 'Shipping Address' ? (
              <ShippingAddressSection />
            ): (
              <></>
            )}
          </div>
          {/* right quick panel */}
          <div className="w-full md:w-1/4 space-y-4">
          <QuickActionCard 
          title="Referral Program"
          Icon={Gift}
          description="Invite friends and earn points"
          />
          <QuickActionCard 
          title="Your Badges"
          Icon={BadgeCheck}
          description="View achievements"
          />
          <QuickActionCard 
          title="Settings"
          Icon={Settings}
          description="Manage preferences and security"
          />
          <QuickActionCard 
          title="Billing History"
          Icon={Receipt}
          description="Check Recent payments"
          />
          <QuickActionCard 
          title="Support Center"
          Icon={PhoneCall}
          description="Need help? Contact support"
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;


interface NavItemsProps {
  label: string;
  Icon: React.ElementType;
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
}

const NavItems: React.FC<NavItemsProps> = ({
  label,
  Icon,
  active = false,
  danger = false,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition ${
      active
        ? "bg-blue-100 text-blue-600"
        : danger
        ? "text-red-500 hover:bg-red-50"
        : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);
