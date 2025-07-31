"use client";

import type * as React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import {
	Package,
	LayoutDashboard,
	FileText,
	Users,
	Settings,
	BarChart3,
	AlertTriangle,
	Plus,
	CheckCircle,
	Search,
	Moon,
	Sun,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

// Navigation data
const clientNavigation = [
	{
		title: "Overview",
		items: [
			{
				title: "Dashboard",
				url: "/dashboard",
				icon: LayoutDashboard,
			},
		],
	},
	{
		title: "Orders",
		items: [
			{
				title: "Submit Order",
				url: "/orders/submit",
				icon: Plus,
			},
			{
				title: "My Orders",
				url: "/orders",
				icon: FileText,
			},
			{
				title: "Track Orders",
				url: "/orders/track",
				icon: Search,
			},
		],
	},
];

const palogisticaNavigation = [
	{
		title: "Overview",
		items: [
			{
				title: "Dashboard",
				url: "/admin",
				icon: LayoutDashboard,
			},
		],
	},
	{
		title: "Operations",
		items: [
			{
				title: "All Orders",
				url: "/admin/orders",
				icon: FileText,
			},
			{
				title: "Incidents",
				url: "/admin/incidents",
				icon: AlertTriangle,
			},
			{
				title: "Deliveries",
				url: "/admin/deliveries",
				icon: CheckCircle,
			},
		],
	},
	{
		title: "Management",
		items: [
			{
				title: "Users",
				url: "/admin/users",
				icon: Users,
			},
			{
				title: "Reports",
				url: "/admin/reports",
				icon: BarChart3,
			},
			{
				title: "Settings",
				url: "/admin/settings",
				icon: Settings,
			},
		],
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user, logout } = useAuth();
	const { theme, setTheme } = useTheme();
	const pathname = usePathname();

	const navigation =
		user?.role === "client" ? clientNavigation : palogisticaNavigation;

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="/">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-sidebar-primary-foreground">
									<Package className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">Palogistica</span>
									<span className="truncate text-xs">Delivery Management</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				{navigation.map((group) => (
					<SidebarGroup key={group.title}>
						<SidebarGroupLabel>{group.title}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild isActive={pathname === item.url}>
											<a href={item.url}>
												<item.icon />
												<span>{item.title}</span>
											</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage
									src={user?.avatar || "/placeholder.svg"}
									alt={user?.name}
								/>
								<AvatarFallback className="rounded-lg">
									{user?.name?.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{user?.name}</span>
								<span className="truncate text-xs">
									{user?.role === "client"
										? user?.companyName
										: "Palogistica Staff"}
								</span>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="ml-auto size-8"
								onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
								<Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
								<Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
							</Button>
						</div>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton onClick={logout}>
							<span>Sign out</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
