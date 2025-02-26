// app/components/ClientProvider.tsx
"use client";

import { UserProvider } from "@/context/userContext";
import React from "react";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
