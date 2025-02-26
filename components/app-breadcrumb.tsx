"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Slash } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AppBreadCrumb() {
  const pathname = usePathname(); 
  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb className="my-5">
      <BreadcrumbList>
        {pathnames.map((value, index) => {
          const href = "/" + pathnames.slice(0, index + 1).join("/");

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator>
                <Slash className="text-gray-500" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={href}>
                  {value.replace(/-/g, " ")}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
