"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Folder, DollarSign, Users, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// Format angka menjadi singkat (Rp 200JT, Rp 2M, dll.)
const formatRupiah = (value: number) => {
  if (value >= 1_000_000_000)
    return `Rp ${(value / 1_000_000_000).toFixed(1)}M`;
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}JT`;
  return `Rp ${value.toLocaleString("id-ID")}`;
};

export default function DashboardPage() {
  const totalBill = 200000000.0; // Ganti dengan angka dinamis
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userString = localStorage.getItem("users") || "{}";
    const userData = JSON.parse(userString);
    setUser(userData);

    if (userData && userData.role_id === 4) {
      router.push("/projects");
    }
  }, [router]);

  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        {/* Total Projects */}
        <Card className="col-span-3 bg-white shadow-md rounded-lg">
          <CardContent className="flex flex-col space-y-2 p-5">
            <div className="flex flex-row justify-between items-center">
              <Label className="font-semibold">Projects</Label>
              <Folder className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex flex-col space-y-1">
              <Label className="text-2xl font-bold">200</Label>
              <Label className="text-gray-500 text-sm">
                Ongoing & completed projects
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Total Bill */}
        <Card className="col-span-3 bg-white shadow-md rounded-lg">
          <CardContent className="flex flex-col space-y-2 p-5">
            <div className="flex flex-row justify-between items-center">
              <Label className="font-semibold">Revenue</Label>
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex flex-col space-y-1">
              <Label className="text-2xl font-bold">
                {formatRupiah(totalBill)}
              </Label>
              <Label className="text-gray-500 text-sm">
                Total income generated
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Total Clients */}
        <Card className="col-span-3 bg-white shadow-md rounded-lg">
          <CardContent className="flex flex-col space-y-2 p-5">
            <div className="flex flex-row justify-between items-center">
              <Label className="font-semibold">Clients</Label>
              <Users className="h-6 w-6 text-purple-500" />
            </div>
            <div className="flex flex-col space-y-1">
              <Label className="text-2xl font-bold">200</Label>
              <Label className="text-gray-500 text-sm">
                Active & past clients
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Total Material Usage */}
        <Card className="col-span-3 bg-white shadow-md rounded-lg">
          <CardContent className="flex flex-col space-y-2 p-5">
            <div className="flex flex-row justify-between items-center">
              <Label className="font-semibold">Material Usage</Label>
              <Package className="h-6 w-6 text-red-500" />
            </div>
            <div className="flex flex-col space-y-1">
              <Label className="text-2xl font-bold">200</Label>
              <Label className="text-gray-500 text-sm">
                Total resources used
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
