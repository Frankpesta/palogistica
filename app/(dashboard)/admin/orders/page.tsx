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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Eye, Edit, Truck } from "lucide-react";
import { mockOrders } from "@/lib/mock-data";
import type { Order } from "@/lib/types";
import { useGSAP } from "@/hooks/use-gsap";

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [companyFilter, setCompanyFilter] = useState<string>("all");
	const containerRef = useGSAP();

	useEffect(() => {
		setOrders(mockOrders);
		setFilteredOrders(mockOrders);
	}, []);

	useEffect(() => {
		let filtered = orders;

		// Search filter
		if (searchTerm) {
			filtered = filtered.filter(
				(order) =>
					order.trackingNumber
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					order.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					order.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Status filter
		if (statusFilter !== "all") {
			filtered = filtered.filter((order) => order.status === statusFilter);
		}

		// Company filter
		if (companyFilter !== "all") {
			filtered = filtered.filter(
				(order) => order.companyName === companyFilter
			);
		}

		setFilteredOrders(filtered);
	}, [searchTerm, statusFilter, companyFilter, orders]);

	const handleAssignDriver = (orderId: string, driver: string) => {
		setOrders((prev) =>
			prev.map((order) =>
				order.id === orderId
					? {
							...order,
							assignedDriver: driver,
							status: "in_progress" as const,
							updatedAt: new Date(),
					  }
					: order
			)
		);
	};

	const handleStatusUpdate = (orderId: string, newStatus: Order["status"]) => {
		setOrders((prev) =>
			prev.map((order) =>
				order.id === orderId
					? {
							...order,
							status: newStatus,
							updatedAt: new Date(),
							...(newStatus === "delivered" && { actualDelivery: new Date() }),
					  }
					: order
			)
		);
	};

	const companies = Array.from(
		new Set(orders.map((order) => order.companyName))
	);
	const drivers = [
		"Mike Rodriguez",
		"Sarah Chen",
		"David Park",
		"Lisa Wang",
		"Carlos Martinez",
	];

	const breadcrumbs = [
		{ label: "Admin Dashboard", href: "/admin" },
		{ label: "All Orders" },
	];

	return (
		<>
			<DashboardHeader breadcrumbs={breadcrumbs} />

			<div ref={containerRef} className="flex-1 space-y-4 p-4 pt-6">
				<div className="fade-in">
					<h2 className="text-3xl font-bold tracking-tight">All Orders</h2>
					<p className="text-muted-foreground">
						Manage delivery orders across all companies
					</p>
				</div>

				{/* Filters */}
				<Card className="slide-up">
					<CardContent className="pt-6">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
								<Input
									placeholder="Search orders..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="w-full md:w-48">
									<SelectValue placeholder="Filter by status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Statuses</SelectItem>
									<SelectItem value="pending">Pending</SelectItem>
									<SelectItem value="confirmed">Confirmed</SelectItem>
									<SelectItem value="in_progress">In Progress</SelectItem>
									<SelectItem value="delivered">Delivered</SelectItem>
									<SelectItem value="issue_reported">Issue Reported</SelectItem>
								</SelectContent>
							</Select>
							<Select value={companyFilter} onValueChange={setCompanyFilter}>
								<SelectTrigger className="w-full md:w-48">
									<SelectValue placeholder="Filter by company" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Companies</SelectItem>
									{companies.map((company) => (
										<SelectItem key={company} value={company}>
											{company}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				{/* Orders Table */}
				<Card className="fade-in">
					<CardHeader>
						<CardTitle>Orders ({filteredOrders.length})</CardTitle>
						<CardDescription>
							Manage and track all delivery orders
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b">
										<th className="text-left py-3 px-2">Tracking #</th>
										<th className="text-left py-3 px-2">Company</th>
										<th className="text-left py-3 px-2">Customer</th>
										<th className="text-left py-3 px-2">Status</th>
										<th className="text-left py-3 px-2">Driver</th>
										<th className="text-left py-3 px-2">Est. Delivery</th>
										<th className="text-left py-3 px-2">Cost</th>
										<th className="text-left py-3 px-2">Actions</th>
									</tr>
								</thead>
								<tbody>
									{filteredOrders.map((order) => (
										<tr
											key={order.id}
											className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
											<td className="py-3 px-2 font-medium">
												{order.trackingNumber}
											</td>
											<td className="py-3 px-2">{order.companyName}</td>
											<td className="py-3 px-2">
												<div>
													<p className="font-medium">{order.customerName}</p>
													<p className="text-xs text-gray-500">
														{order.customerPhone}
													</p>
												</div>
											</td>
											<td className="py-3 px-2">
												<StatusBadge status={order.status} />
											</td>
											<td className="py-3 px-2">
												{order.assignedDriver ? (
													<Badge variant="outline">
														{order.assignedDriver}
													</Badge>
												) : (
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="outline" size="sm">
																<Truck className="h-4 w-4 mr-1" />
																Assign
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent>
															{drivers.map((driver) => (
																<DropdownMenuItem
																	key={driver}
																	onClick={() =>
																		handleAssignDriver(order.id, driver)
																	}>
																	{driver}
																</DropdownMenuItem>
															))}
														</DropdownMenuContent>
													</DropdownMenu>
												)}
											</td>
											<td className="py-3 px-2">
												{order.estimatedDelivery?.toLocaleDateString() || "TBD"}
											</td>
											<td className="py-3 px-2">
												{order.cost ? `$${order.cost.toFixed(2)}` : "Pending"}
											</td>
											<td className="py-3 px-2">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="sm">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent>
														<DropdownMenuItem>
															<Eye className="h-4 w-4 mr-2" />
															View Details
														</DropdownMenuItem>
														<DropdownMenuItem>
															<Edit className="h-4 w-4 mr-2" />
															Edit Order
														</DropdownMenuItem>
														{order.status === "confirmed" && (
															<DropdownMenuItem
																onClick={() =>
																	handleStatusUpdate(order.id, "in_progress")
																}>
																Mark In Progress
															</DropdownMenuItem>
														)}
														{order.status === "in_progress" && (
															<DropdownMenuItem
																onClick={() =>
																	handleStatusUpdate(order.id, "delivered")
																}>
																Mark Delivered
															</DropdownMenuItem>
														)}
													</DropdownMenuContent>
												</DropdownMenu>
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
