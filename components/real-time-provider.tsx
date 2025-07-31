"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { Order, NotificationData } from "@/lib/types";
import { mockOrders, mockNotifications } from "@/lib/mock-data";
import { useAuth } from "./auth-provider";
import { toast } from "sonner";

interface RealTimeContextType {
	orders: Order[];
	notifications: NotificationData[];
	updateOrderStatus: (orderId: string, status: Order["status"]) => void;
	addNotification: (
		notification: Omit<NotificationData, "id" | "timestamp">
	) => void;
}

const RealTimeContext = createContext<RealTimeContextType | undefined>(
	undefined
);

export function RealTimeProvider({ children }: { children: React.ReactNode }) {
	const { user } = useAuth();
	const [orders, setOrders] = useState<Order[]>(mockOrders);
	const [notifications, setNotifications] =
		useState<NotificationData[]>(mockNotifications);

	// Simulate real-time order status updates
	useEffect(() => {
		const interval = setInterval(() => {
			// Randomly update order status
			const activeOrders = orders.filter(
				(o) => o.status !== "delivered" && o.status !== "issue_reported"
			);

			if (activeOrders.length > 0) {
				const randomOrder =
					activeOrders[Math.floor(Math.random() * activeOrders.length)];
				const statusProgression = {
					pending: "confirmed",
					confirmed: "in_progress",
					in_progress: Math.random() > 0.8 ? "issue_reported" : "delivered",
				};

				const newStatus =
					statusProgression[
						randomOrder.status as keyof typeof statusProgression
					];
				if (newStatus) {
					updateOrderStatus(randomOrder.id, newStatus as Order["status"]);
				}
			}
		}, 15000); // Update every 15 seconds

		return () => clearInterval(interval);
	}, [orders]);

	const updateOrderStatus = (orderId: string, status: Order["status"]) => {
		setOrders((prev) =>
			prev.map((order) =>
				order.id === orderId
					? {
							...order,
							status,
							updatedAt: new Date(),
							...(status === "delivered" && { actualDelivery: new Date() }),
					  }
					: order
			)
		);

		// Add notification
		const order = orders.find((o) => o.id === orderId);
		if (order && user) {
			const notification: Omit<NotificationData, "id" | "timestamp"> = {
				type: "order_update",
				title: "Order Status Updated",
				message: `Order ${order.trackingNumber} is now ${status.replace(
					"_",
					" "
				)}`,
				read: false,
				userId: user.id,
				orderId,
			};
			addNotification(notification);
		}
	};

	const addNotification = (
		notification: Omit<NotificationData, "id" | "timestamp">
	) => {
		const newNotification: NotificationData = {
			...notification,
			id: `NOT-${Date.now()}`,
			timestamp: new Date(),
		};

		setNotifications((prev) => [newNotification, ...prev]);

		// Show toast for current user
		if (notification.userId === user?.id) {
			toast(`${notification.message}`);
		}
	};

	return (
		<RealTimeContext.Provider
			value={{
				orders,
				notifications,
				updateOrderStatus,
				addNotification,
			}}>
			{children}
		</RealTimeContext.Provider>
	);
}

export function useRealTime() {
	const context = useContext(RealTimeContext);
	if (context === undefined) {
		throw new Error("useRealTime must be used within a RealTimeProvider");
	}
	return context;
}
