"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, DollarSign, Truck } from "lucide-react";
import { mockOrders, mockIncidents } from "@/lib/mock-data";
import type { Order, Incident } from "@/lib/types";
import { useGSAP } from "@/hooks/use-gsap";

export default function AdminDashboard() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [incidents, setIncidents] = useState<Incident[]>([]);
	const containerRef = useGSAP();

	useEffect(() => {
		setOrders(mockOrders);
		setIncidents(mockIncidents);
	}, []);

	const stats = {
		totalOrders: orders.length,
		pending: orders.filter((o) => o.status === "pending").length,
		inProgress: orders.filter((o) => o.status === "in_progress").length,
		delivered: orders.filter((o) => o.status === "delivered").length,
		issues: orders.filter((o) => o.status === "issue_reported").length,
		activeIncidents: incidents.filter((i) => i.status !== "resolved").length,
		totalRevenue: orders
			.filter((o) => o.cost)
			.reduce((sum, o) => sum + (o.cost || 0), 0),
	};

	return (
		<>
			<DashboardHeader title="Admin Dashboard" />

			<div ref={containerRef} className="flex-1 space-y-4 p-4 pt-6">
				{/* Welcome Section */}
				<div className="fade-in">
					<h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
					<p className="text-muted-foreground">
						Complete overview of all delivery operations
					</p>
				</div>

				{/* Stats Grid */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Orders
							</CardTitle>
							<Package className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.totalOrders}</div>
							<p className="text-xs text-muted-foreground">
								<span className="text-green-600">+12%</span> from last month
							</p>
						</CardContent>
					</Card>

					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Active Deliveries
							</CardTitle>
							<Truck className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-blue-600">
								{stats.inProgress}
							</div>
							<p className="text-xs text-muted-foreground">
								Currently in progress
							</p>
						</CardContent>
					</Card>

					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Revenue</CardTitle>
							<DollarSign className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-600">
								${stats.totalRevenue.toFixed(2)}
							</div>
							<p className="text-xs text-muted-foreground">
								<span className="text-green-600">+8%</span> from last month
							</p>
						</CardContent>
					</Card>

					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Active Incidents
							</CardTitle>
							<AlertTriangle className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-red-600">
								{stats.activeIncidents}
							</div>
							<p className="text-xs text-muted-foreground">Require attention</p>
						</CardContent>
					</Card>
				</div>

				{/* Status Overview */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
					<Card className="scale-in col-span-4">
						<CardHeader>
							<CardTitle>Order Status Overview</CardTitle>
							<CardDescription>
								Current distribution of order statuses
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
										<span className="text-sm">Pending</span>
									</div>
									<Badge variant="secondary">{stats.pending}</Badge>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<div className="w-3 h-3 bg-blue-500 rounded-full"></div>
										<span className="text-sm">Confirmed</span>
									</div>
									<Badge variant="secondary">
										{orders.filter((o) => o.status === "confirmed").length}
									</Badge>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<div className="w-3 h-3 bg-purple-500 rounded-full"></div>
										<span className="text-sm">In Progress</span>
									</div>
									<Badge variant="secondary">{stats.inProgress}</Badge>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<div className="w-3 h-3 bg-green-500 rounded-full"></div>
										<span className="text-sm">Delivered</span>
									</div>
									<Badge variant="secondary">{stats.delivered}</Badge>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="scale-in col-span-3">
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
							<CardDescription>Latest updates and changes</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{orders.slice(0, 4).map((order) => (
									<div key={order.id} className="flex items-center space-x-3">
										<div className="w-2 h-2 bg-blue-600 rounded-full"></div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium truncate">
												Order {order.trackingNumber}
											</p>
											<p className="text-xs text-gray-500 flex items-center gap-1">
												Status updated to <StatusBadge status={order.status} />
											</p>
										</div>
										<span className="text-xs text-gray-500">
											{order.updatedAt.toLocaleTimeString()}
										</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Recent Orders Table */}
				<Card className="fade-in">
					<CardHeader>
						<CardTitle>Recent Orders</CardTitle>
						<CardDescription>
							Latest delivery requests across all companies
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b">
										<th className="text-left py-2">Tracking #</th>
										<th className="text-left py-2">Company</th>
										<th className="text-left py-2">Customer</th>
										<th className="text-left py-2">Status</th>
										<th className="text-left py-2">Driver</th>
										<th className="text-left py-2">Est. Delivery</th>
									</tr>
								</thead>
								<tbody>
									{orders.map((order) => (
										<tr
											key={order.id}
											className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
											<td className="py-3 font-medium">
												{order.trackingNumber}
											</td>
											<td className="py-3">{order.companyName}</td>
											<td className="py-3">{order.customerName}</td>
											<td className="py-3">
												<StatusBadge status={order.status} />
											</td>
											<td className="py-3">
												{order.assignedDriver || "Unassigned"}
											</td>
											<td className="py-3">
												{order.estimatedDelivery?.toLocaleDateString() || "TBD"}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
