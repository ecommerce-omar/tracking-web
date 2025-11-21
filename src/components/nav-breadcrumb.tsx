"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const breadcrumbLabels: Record<string, string> = {
  "/": "Dashboard",
  "/shipments": "Envios em Andamento",
  "/tracking": "Rastreamento",
  "/templates-email": "Templates de Email",
  "/notification-settings": "Configurações de Notificações",
};

export function NavBreadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  if (pathSegments.length < 2) {
    const segmentPath = `/${pathSegments}`;
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{breadcrumbLabels[segmentPath]}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          const isIntermediate = index < pathSegments.length - 1;
          const isLast = index === pathSegments.length - 1;
          const fullSegmentPath = `/${pathSegments
            .slice(0, index + 1)
            .join("/")}`;
          const segmentPath = `/${segment}`;

          return (
            <span className="flex items-center gap-2" key={index}>
              {isIntermediate && (
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link href={fullSegmentPath}>
                      {breadcrumbLabels[segmentPath] ?? segment}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )}

              {isIntermediate && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}

              {isLast && (
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {breadcrumbLabels[segmentPath] ?? segment}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
