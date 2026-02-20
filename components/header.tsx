"use client";

import type { ComponentPropsWithRef, ComponentType } from "react";
import Link from "next/link";
import {
  Building2,
  FileText,
  Settings2,
  Hammer,
  Users,
  LayoutDashboard,
  Receipt,
  FolderKanban,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

const navigationItems = {
  direccion: {
    title: "Dirección",
    icon: Settings2,
    items: [
      {
        title: "Inicio",
        href: "/dashboard",
        description: "Vista general del dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Proyectos",
        href: "/dashboard/direccion/proyectos",
        description: "Gestión de proyectos de dirección",
        icon: FolderKanban,
      },
    ],
  },
  arquitectura: {
    title: "Arquitectura",
    icon: Building2,
    items: [
      {
        title: "Proyectos",
        href: "/dashboard/arquitectura/proyectos",
        description: "Proyectos arquitectónicos",
        icon: FolderKanban,
      },
    ],
  },
  obra: {
    title: "Obra",
    icon: Hammer,
    items: [
      {
        title: "Proyectos",
        href: "/dashboard/obra/proyectos",
        description: "Gestión de obras y construcción",
        icon: FolderKanban,
      },
    ],
  },
  auxadmin: {
    title: "Administración",
    icon: FileText,
    items: [
      {
        title: "Proyectos",
        href: "/dashboard/auxadmin/proyectos",
        description: "Proyectos administrativos",
        icon: FolderKanban,
      },
      {
        title: "Recibos",
        href: "/dashboard/auxadmin/recibos",
        description: "Gestión de recibos y pagos",
        icon: Receipt,
      },
      {
        title: "Usuarios",
        href: "/dashboard/auxadmin/usuarios",
        description: "Administración de usuarios",
        icon: Users,
      },
    ],
  },
};

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
          <Building2 className="size-6" />
          <span className="hidden font-bold sm:inline-block">ArqManager</span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {Object.entries(navigationItems).map(([key, section]) => (
              <NavigationMenuItem key={key}>
                <NavigationMenuTrigger className="h-9">
                  <section.icon className="mr-2 size-4" />
                  {section.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-100 gap-3 p-4 md:w-125 md:grid-cols-2 lg:w-150">
                    {section.items.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                        icon={item.icon}
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 size-4" />
                  Dashboard
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

interface ListItemProps extends ComponentPropsWithRef<"a"> {
  title: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
}

function ListItem({
  className,
  title,
  children,
  icon: Icon,
  href,
  ref,
  ...props
}: ListItemProps) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="flex items-center text-sm font-medium leading-none">
            {Icon && <Icon className="mr-2 size-4" />}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
