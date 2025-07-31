"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader } from "@/components/dashboard-header";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
	Package,
	Clock,
	CheckCircle,
	AlertTriangle,
	Plus,
	Eye,
} from "lucide-react";
import { mockOrders } from "@/lib/mock-data";
import type { Order } from "@/lib/types";
import { useGSAP } from "@/hooks/use-gsap";
import Link from "next/link";

export default function ClientDashboard() {
	const { user } = useAuth();
	const [orders, setOrders] = useState<Order[]>([]);
	const containerRef = useGSAP();

	useEffect(() => {
		// Filter orders for current company
		const companyOrders = mockOrders.filter(
			(order) => order.companyId === user?.companyId
		);
		setOrders(companyOrders);
	}, [user]);

	const stats = {
		total: orders.length,
		pending: orders.filter((o) => o.status === "pending").length,
		inProgress: orders.filter((o) => o.status === "in_progress").length,
		delivered: orders.filter((o) => o.status === "delivered").length,
		issues: orders.filter((o) => o.status === "issue_reported").length,
	};

	return (
		<>
			<DashboardHeader title="Dashboard" />

			<div ref={containerRef} className="flex-1 space-y-4 p-4 pt-6">
				{/* Welcome Section */}
				<div className="fade-in">
					<h2 className="text-3xl font-bold tracking-tight">
						Welcome back, {user?.name}
					</h2>
					<p className="text-muted-foreground">
						Here's an overview of your delivery orders
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Orders
							</CardTitle>
							<Package className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stats.total}</div>
							<p className="text-xs text-muted-foreground">All time orders</p>
						</CardContent>
					</Card>

					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">In Progress</CardTitle>
							<Clock className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-blue-600">
								{stats.inProgress}
							</div>
							<p className="text-xs text-muted-foreground">
								Currently being delivered
							</p>
						</CardContent>
					</Card>

					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Delivered</CardTitle>
							<CheckCircle className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-600">
								{stats.delivered}
							</div>
							<p className="text-xs text-muted-foreground">
								Successfully completed
							</p>
						</CardContent>
					</Card>

					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Issues</CardTitle>
							<AlertTriangle className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-red-600">
								{stats.issues}
							</div>
							<p className="text-xs text-muted-foreground">Require attention</p>
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions */}
				<Card className="scale-in">
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
						<CardDescription>
							Common tasks you might want to perform
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-4">
							<Button asChild className="bg-blue-600 hover:bg-blue-700">
								<Link href="/orders/submit">
									<Plus className="mr-2 h-4 w-4" />
									Submit New Order
								</Link>
							</Button>
							<Button variant="outline" asChild>
								<Link href="/orders/track">
									<Eye className="mr-2 h-4 w-4" />
									Track Orders
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Recent Orders */}
				<Card className="fade-in">
					<CardHeader>
						<CardTitle>Recent Orders</CardTitle>
						<CardDescription>Your latest delivery requests</CardDescription>
					</CardHeader>
					<CardContent>
						{orders.length === 0 ? (
							<div className="text-center py-8">
								<Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-500">No orders found</p>
								<Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
									<Link href="/orders/submit">Submit Your First Order</Link>
								</Button>
							</div>
						) : (
							<div className="space-y-4">
								{orders.slice(0, 5).map((order) => (
									<div
										key={order.id}
										className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
										<div className="flex-1">
											<div className="flex items-center space-x-4">
												<div>
													<p className="font-medium">{order.trackingNumber}</p>
													<p className="text-sm text-gray-500">
														{order.customerName}
													</p>
												</div>
												<StatusBadge status={order.status} />
											</div>
											<p className="text-sm text-gray-500 mt-1">
												{order.deliveryAddress}
											</p>
										</div>
										<div className="text-right">
											<p className="text-sm font-medium">
												{order.estimatedDelivery?.toLocaleDateString()}
											</p>
											<p className="text-xs text-gray-500">Est. Delivery</p>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</>
	);
}
