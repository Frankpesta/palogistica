"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Search, Package } from "lucide-react";
import { mockOrders } from "@/lib/mock-data";
import type { Order } from "@/lib/types";
import { useGSAP } from "@/hooks/use-gsap";
import { User, MapPin, Clock } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";

export default function TrackOrdersPage() {
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

	const getStatusProgress = (status: string) => {
		const statusOrder = ["pending", "confirmed", "in_progress", "delivered"];
		return ((statusOrder.indexOf(status) + 1) / statusOrder.length) * 100;
	};

	return (
		<>
			<DashboardHeader
				breadcrumbs={[
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Track Orders" },
				]}
			/>

			<div ref={containerRef} className="flex-1 space-y-4 p-4 pt-6">
				{/* Header */}
				<div className="fade-in">
					<h2 className="text-3xl font-bold tracking-tight">Track Orders</h2>
					<p className="text-muted-foreground">
						Monitor the status and progress of your deliveries
					</p>
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
				<div className="space-y-4">
					{filteredOrders.length === 0 ? (
						<Card className="scale-in">
							<CardContent className="text-center py-12">
								<Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-500">
									{searchTerm
										? "No orders found matching your search"
										: "No orders to track"}
								</p>
							</CardContent>
						</Card>
					) : (
						filteredOrders.map((order) => (
							<Card
								key={order.id}
								className="fade-in hover:shadow-lg transition-shadow">
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle className="text-lg">
												{order.trackingNumber}
											</CardTitle>
											<CardDescription>
												Created on {order.createdAt.toLocaleDateString()}
											</CardDescription>
										</div>
										<StatusBadge status={order.status} />
									</div>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Progress Bar */}
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Progress</span>
											<span>
												{Math.round(getStatusProgress(order.status))}%
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className="bg-blue-600 h-2 rounded-full transition-all duration-500"
												style={{ width: `${getStatusProgress(order.status)}%` }}
											/>
										</div>
									</div>

									{/* Order Details Grid */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* Customer Info */}
										<div className="space-y-3">
											<h4 className="font-semibold flex items-center">
												<User className="h-4 w-4 mr-2" />
												Customer Information
											</h4>
											<div className="space-y-1 text-sm">
												<p>
													<strong>Name:</strong> {order.customerName}
												</p>
												<p>
													<strong>Phone:</strong> {order.customerPhone}
												</p>
												{order.customerEmail && (
													<p>
														<strong>Email:</strong> {order.customerEmail}
													</p>
												)}
											</div>
										</div>

										{/* Delivery Info */}
										<div className="space-y-3">
											<h4 className="font-semibold flex items-center">
												<MapPin className="h-4 w-4 mr-2" />
												Delivery Information
											</h4>
											<div className="space-y-1 text-sm">
												<p>
													<strong>From:</strong> {order.pickupAddress}
												</p>
												<p>
													<strong>To:</strong> {order.deliveryAddress}
												</p>
												{order.assignedDriver && (
													<p>
														<strong>Driver:</strong> {order.assignedDriver}
													</p>
												)}
											</div>
										</div>
									</div>

									{/* Package Details */}
									<div className="space-y-3">
										<h4 className="font-semibold flex items-center">
											<Package className="h-4 w-4 mr-2" />
											Package Details
										</h4>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
											<div>
												<p>
													<strong>Contents:</strong> {order.packageDetails}
												</p>
											</div>
											<div>
												<p>
													<strong>Weight:</strong> {order.weight} kg
												</p>
											</div>
											<div>
												<p>
													<strong>Dimensions:</strong> {order.dimensions}
												</p>
											</div>
										</div>
										{order.specialInstructions && (
											<div className="mt-2">
												<p>
													<strong>Special Instructions:</strong>{" "}
													{order.specialInstructions}
												</p>
											</div>
										)}
									</div>

									{/* Timeline */}
									<div className="space-y-3">
										<h4 className="font-semibold flex items-center">
											<Clock className="h-4 w-4 mr-2" />
											Timeline
										</h4>
										<div className="space-y-2">
											<div className="flex items-center justify-between text-sm">
												<span>Estimated Delivery:</span>
												<Badge variant="outline">
													{order.estimatedDelivery?.toLocaleDateString()} at{" "}
													{order.estimatedDelivery?.toLocaleTimeString()}
												</Badge>
											</div>
											{order.actualDelivery && (
												<div className="flex items-center justify-between text-sm">
													<span>Actual Delivery:</span>
													<Badge variant="default" className="bg-green-600">
														{order.actualDelivery.toLocaleDateString()} at{" "}
														{order.actualDelivery.toLocaleTimeString()}
													</Badge>
												</div>
											)}
											{order.cost && (
												<div className="flex items-center justify-between text-sm">
													<span>Total Cost:</span>
													<Badge variant="outline">
														${order.cost.toFixed(2)}
													</Badge>
												</div>
											)}
										</div>
									</div>

									{/* Delivery Notes */}
									{order.deliveryNotes && (
										<div className="space-y-2">
											<h4 className="font-semibold">Delivery Notes</h4>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												{order.deliveryNotes}
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						))
					)}
				</div>
			</div>
		</>
	);
}
