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
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
	BarChart3,
	TrendingUp,
	Download,
	DollarSign,
	Package,
	Clock,
	Users,
} from "lucide-react";
import { mockOrders } from "@/lib/mock-data";
import type { Order } from "@/lib/types";
import { useGSAP } from "@/hooks/use-gsap";

export default function AdminReportsPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [timeRange, setTimeRange] = useState("30");
	const [reportType, setReportType] = useState("overview");
	const containerRef = useGSAP();

	useEffect(() => {
		setOrders(mockOrders);
	}, []);

	// Calculate metrics based on time range
	const getFilteredOrders = () => {
		const days = Number.parseInt(timeRange);
		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - days);

		return orders.filter((order) => order.createdAt >= cutoffDate);
	};

	const filteredOrders = getFilteredOrders();

	const metrics = {
		totalOrders: filteredOrders.length,
		totalRevenue: filteredOrders.reduce(
			(sum, order) => sum + (order.cost || 0),
			0
		),
		avgDeliveryTime: 2.5, // Mock average delivery time in days
		completionRate:
			(filteredOrders.filter((o) => o.status === "delivered").length /
				filteredOrders.length) *
			100,
		pendingOrders: filteredOrders.filter((o) => o.status === "pending").length,
		inProgressOrders: filteredOrders.filter((o) => o.status === "in_progress")
			.length,
		deliveredOrders: filteredOrders.filter((o) => o.status === "delivered")
			.length,
		issueOrders: filteredOrders.filter((o) => o.status === "issue_reported")
			.length,
	};

	// Company performance data
	const companyPerformance = orders.reduce((acc, order) => {
		const company = order.companyName;
		if (!acc[company]) {
			acc[company] = { orders: 0, revenue: 0, delivered: 0 };
		}
		acc[company].orders++;
		acc[company].revenue += order.cost || 0;
		if (order.status === "delivered") acc[company].delivered++;
		return acc;
	}, {} as Record<string, { orders: number; revenue: number; delivered: number }>);

	// Driver performance data
	const driverPerformance = orders.reduce((acc, order) => {
		if (order.assignedDriver) {
			if (!acc[order.assignedDriver]) {
				acc[order.assignedDriver] = { orders: 0, delivered: 0, revenue: 0 };
			}
			acc[order.assignedDriver].orders++;
			acc[order.assignedDriver].revenue += order.cost || 0;
			if (order.status === "delivered") acc[order.assignedDriver].delivered++;
		}
		return acc;
	}, {} as Record<string, { orders: number; delivered: number; revenue: number }>);

	const breadcrumbs = [
		{ label: "Admin Dashboard", href: "/admin" },
		{ label: "Reports & Analytics" },
	];

	return (
		<>
			<DashboardHeader breadcrumbs={breadcrumbs} />

			<div ref={containerRef} className="flex-1 space-y-4 p-4 pt-6">
				<div className="fade-in">
					<h2 className="text-3xl font-bold tracking-tight">
						Reports & Analytics
					</h2>
					<p className="text-muted-foreground">
						Comprehensive insights into delivery operations
					</p>
				</div>

				{/* Controls */}
				<Card className="slide-up">
					<CardContent className="pt-6">
						<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
							<div className="flex gap-4">
								<Select value={timeRange} onValueChange={setTimeRange}>
									<SelectTrigger className="w-48">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="7">Last 7 days</SelectItem>
										<SelectItem value="30">Last 30 days</SelectItem>
										<SelectItem value="90">Last 90 days</SelectItem>
										<SelectItem value="365">Last year</SelectItem>
									</SelectContent>
								</Select>
								<Select value={reportType} onValueChange={setReportType}>
									<SelectTrigger className="w-48">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="overview">Overview</SelectItem>
										<SelectItem value="financial">Financial</SelectItem>
										<SelectItem value="operational">Operational</SelectItem>
										<SelectItem value="performance">Performance</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<Button>
								<Download className="h-4 w-4 mr-2" />
								Export Report
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Key Metrics */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Orders
							</CardTitle>
							<Package className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{metrics.totalOrders}</div>
							<p className="text-xs text-muted-foreground">
								<span className="text-green-600">+12%</span> from previous
								period
							</p>
						</CardContent>
					</Card>

					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total Revenue
							</CardTitle>
							<DollarSign className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								${metrics.totalRevenue.toFixed(2)}
							</div>
							<p className="text-xs text-muted-foreground">
								<span className="text-green-600">+8%</span> from previous period
							</p>
						</CardContent>
					</Card>

					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Avg Delivery Time
							</CardTitle>
							<Clock className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{metrics.avgDeliveryTime} days
							</div>
							<p className="text-xs text-muted-foreground">
								<span className="text-green-600">-5%</span> from previous period
							</p>
						</CardContent>
					</Card>

					<Card className="slide-up">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Completion Rate
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{metrics.completionRate.toFixed(1)}%
							</div>
							<p className="text-xs text-muted-foreground">
								<span className="text-green-600">+2%</span> from previous period
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Order Status Distribution */}
				<Card className="fade-in">
					<CardHeader>
						<CardTitle>Order Status Distribution</CardTitle>
						<CardDescription>
							Breakdown of order statuses in the selected period
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="text-center p-4 border rounded-lg">
								<div className="text-2xl font-bold text-yellow-600">
									{metrics.pendingOrders}
								</div>
								<p className="text-sm text-muted-foreground">Pending</p>
							</div>
							<div className="text-center p-4 border rounded-lg">
								<div className="text-2xl font-bold text-blue-600">
									{metrics.inProgressOrders}
								</div>
								<p className="text-sm text-muted-foreground">In Progress</p>
							</div>
							<div className="text-center p-4 border rounded-lg">
								<div className="text-2xl font-bold text-green-600">
									{metrics.deliveredOrders}
								</div>
								<p className="text-sm text-muted-foreground">Delivered</p>
							</div>
							<div className="text-center p-4 border rounded-lg">
								<div className="text-2xl font-bold text-red-600">
									{metrics.issueOrders}
								</div>
								<p className="text-sm text-muted-foreground">Issues</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Company Performance */}
				<Card className="fade-in">
					<CardHeader>
						<CardTitle>Company Performance</CardTitle>
						<CardDescription>
							Performance metrics by client company
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{Object.entries(companyPerformance).map(([company, data]) => (
								<div
									key={company}
									className="flex items-center justify-between p-4 border rounded-lg">
									<div>
										<h3 className="font-semibold">{company}</h3>
										<p className="text-sm text-muted-foreground">
											{data.orders} orders •{" "}
											{((data.delivered / data.orders) * 100).toFixed(1)}%
											completion rate
										</p>
									</div>
									<div className="text-right">
										<div className="font-semibold text-green-600">
											${data.revenue.toFixed(2)}
										</div>
										<Badge variant="outline">{data.delivered} delivered</Badge>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Driver Performance */}
				<Card className="fade-in">
					<CardHeader>
						<CardTitle>Driver Performance</CardTitle>
						<CardDescription>
							Performance metrics by delivery driver
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{Object.entries(driverPerformance).map(([driver, data]) => (
								<div
									key={driver}
									className="flex items-center justify-between p-4 border rounded-lg">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
											<Users className="h-5 w-5 text-blue-600" />
										</div>
										<div>
											<h3 className="font-semibold">{driver}</h3>
											<p className="text-sm text-muted-foreground">
												{data.orders} orders •{" "}
												{((data.delivered / data.orders) * 100).toFixed(1)}%
												completion rate
											</p>
										</div>
									</div>
									<div className="text-right">
										<div className="font-semibold text-green-600">
											${data.revenue.toFixed(2)}
										</div>
										<Badge variant="outline">{data.delivered} delivered</Badge>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Revenue Trends */}
				<Card className="fade-in">
					<CardHeader>
						<CardTitle>Revenue Trends</CardTitle>
						<CardDescription>Revenue analysis over time</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
							<div className="text-center">
								<BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-500">
									Revenue chart would be displayed here
								</p>
								<p className="text-sm text-gray-400">
									Integration with charting library needed
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
