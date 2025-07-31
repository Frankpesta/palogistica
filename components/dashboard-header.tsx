"use client";

import React from "react";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Bell } from "lucide-react";
import { mockNotifications } from "@/lib/mock-data";
import type { NotificationData } from "@/lib/types";

interface DashboardHeaderProps {
	title?: string;
	breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function DashboardHeader({ title, breadcrumbs }: DashboardHeaderProps) {
	const { user } = useAuth();
	const [notifications, setNotifications] = useState<NotificationData[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);

	useEffect(() => {
		// Filter notifications for current user
		const userNotifications = mockNotifications.filter(
			(n) => n.userId === user?.id
		);
		setNotifications(userNotifications);
		setUnreadCount(userNotifications.filter((n) => !n.read).length);
	}, [user]);

	const markAsRead = (notificationId: string) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
		);
		setUnreadCount((prev) => Math.max(0, prev - 1));
	};

	return (
		<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				{breadcrumbs && breadcrumbs.length > 0 ? (
					<Breadcrumb>
						<BreadcrumbList>
							{breadcrumbs.map((crumb, index) => (
								<React.Fragment key={index}>
									<BreadcrumbItem
										className={index === 0 ? "hidden md:block" : ""}>
										{crumb.href ? (
											<BreadcrumbLink href={crumb.href}>
												{crumb.label}
											</BreadcrumbLink>
										) : (
											<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
										)}
									</BreadcrumbItem>
									{index < breadcrumbs.length - 1 && (
										<BreadcrumbSeparator className="hidden md:block" />
									)}
								</React.Fragment>
							))}
						</BreadcrumbList>
					</Breadcrumb>
				) : (
					title && <h1 className="text-lg font-semibold">{title}</h1>
				)}
			</div>

			<div className="ml-auto px-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="relative">
							<Bell className="h-4 w-4" />
							{unreadCount > 0 && (
								<Badge
									variant="destructive"
									className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
									{unreadCount}
								</Badge>
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-80">
						<div className="p-2">
							<h3 className="font-semibold mb-2">Notifications</h3>
							{notifications.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									No notifications
								</p>
							) : (
								<div className="space-y-2 max-h-64 overflow-y-auto">
									{notifications.map((notification) => (
										<DropdownMenuItem
											key={notification.id}
											className="flex flex-col items-start p-3 cursor-pointer"
											onClick={() => markAsRead(notification.id)}>
											<div className="flex items-center justify-between w-full">
												<span className="font-medium text-sm">
													{notification.title}
												</span>
												{!notification.read && (
													<div className="h-2 w-2 bg-blue-600 rounded-full" />
												)}
											</div>
											<p className="text-xs text-muted-foreground mt-1">
												{notification.message}
											</p>
											<span className="text-xs text-muted-foreground mt-1">
												{notification.timestamp.toLocaleTimeString()}
											</span>
										</DropdownMenuItem>
									))}
								</div>
							)}
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
