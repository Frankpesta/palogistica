"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader } from "@/components/dashboard-header";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Search, Package, Plus } from "lucide-react";
import { mockOrders } from "@/lib/mock-data";
import type { Order } from "@/lib/types";
import { useGSAP } from "@/hooks/use-gsap";
import Link from "next/link";

export default function OrdersPage() {
	const { user } = useAuth();
	const [searchTerm, setSearchTerm] = useState("");
	const [orders, setOrders] = useState<Order[]>([]);
	const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
	const containerRef = useGSAP();

	useEffect(() => {
		// Filter orders for current company
		const companyOrders = mockOrders.filter(
			(order) => order.companyId === user?.companyId
		);
		setOrders(companyOrders);
		setFilteredOrders(companyOrders);
	}, [user]);

	useEffect(() => {
		if (searchTerm) {
			const filtered = orders.filter(
				(order) =>
					order.trackingNumber
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					order.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setFilteredOrders(filtered);
		} else {
			setFilteredOrders(orders);
		}
	}, [searchTerm, orders]);

	const breadcrumbs = [
		{ label: "Dashboard", href: "/dashboard" },
		{ label: "My Orders" },
	];

	return (
		<>
			<DashboardHeader breadcrumbs={breadcrumbs} />

			<div ref={containerRef} className="flex-1 space-y-4 p-4 pt-6">
				<div className="flex items-center justify-between fade-in">
					<div>
						<h2 className="text-3xl font-bold tracking-tight">My Orders</h2>
						<p className="text-muted-foreground">
							Manage and track your delivery orders
						</p>
					</div>
					<Button asChild className="bg-blue-600 hover:bg-blue-700">
						<Link href="/orders/submit">
							<Plus className="mr-2 h-4 w-4" />
							Submit Order
						</Link>
					</Button>
				</div>

				{/* Search */}
				<Card className="slide-up">
					<CardContent className="pt-6">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								placeholder="Search by tracking number, customer name, or address..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Orders List */}
				<Card className="fade-in">
					<CardHeader>
						<CardTitle>Orders ({filteredOrders.length})</CardTitle>
						<CardDescription>
							Your delivery requests and their current status
						</CardDescription>
					</CardHeader>
					<CardContent>
						{filteredOrders.length === 0 ? (
							<div className="text-center py-12">
								<Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-500">
									{searchTerm
										? "No orders found matching your search"
										: "No orders found"}
								</p>
								{!searchTerm && (
									<Button
										asChild
										className="mt-4 bg-blue-600 hover:bg-blue-700">
										<Link href="/orders/submit">Submit Your First Order</Link>
									</Button>
								)}
							</div>
						) : (
							<div className="space-y-4">
								{filteredOrders.map((order) => (
									<div
										key={order.id}
										className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
										<div className="flex-1">
											<div className="flex items-center space-x-4 mb-2">
												<div>
													<p className="font-medium">{order.trackingNumber}</p>
													<p className="text-sm text-gray-500">
														{order.customerName}
													</p>
												</div>
												<StatusBadge status={order.status} />
											</div>
											<div className="text-sm text-gray-500 space-y-1">
												<p>
													<strong>From:</strong> {order.pickupAddress}
												</p>
												<p>
													<strong>To:</strong> {order.deliveryAddress}
												</p>
												<p>
													<strong>Package:</strong> {order.packageDetails}
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-sm font-medium">
												{order.estimatedDelivery?.toLocaleDateString()}
											</p>
											<p className="text-xs text-gray-500">Est. Delivery</p>
											{order.cost && (
												<p className="text-sm font-medium text-green-600 mt-1">
													${order.cost.toFixed(2)}
												</p>
											)}
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
