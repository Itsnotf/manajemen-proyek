"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "./ui/sidebar";
import { ChevronDown } from "lucide-react";
import { useUser } from "@/context/userContext";
import { Logout } from "@/services/auth";
import { useRouter } from "next/navigation";
import User from "@/types/users";


export default function AppNavbar() {
  const router = useRouter();
  const [users, setUsers] = useState<User | null>(null);
  
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    const parsedUsers = storedUsers ? JSON.parse(storedUsers) : null;
    setUsers(parsedUsers);
  }, []);

  
  const handleLogout = async () => {
    try {
      await Logout(); 
      localStorage.removeItem("users");
      router.push("/login"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className="sticky top-0 left-0 w-full border-b p-2 mb-4 bg-gray-100 z-50">
      <div className="w-full flex justify-between items-center px-4">
        <SidebarTrigger />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 focus:outline-none">
              <Avatar>
                <AvatarFallback className="bg-white">{users?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{users?.name}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLogout()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
