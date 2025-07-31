export type OrderStatus =
	| "pending"
	| "confirmed"
	| "in_progress"
	| "delivered"
	| "issue_reported";

export interface Order {
	id: string;
	companyId: string;
	companyName: string;
	customerName: string;
	customerPhone: string;
	customerEmail: string;
	pickupAddress: string;
	deliveryAddress: string;
	packageDetails: string;
	weight: number;
	dimensions: string;
	specialInstructions?: string;
	status: OrderStatus;
	createdAt: Date;
	updatedAt: Date;
	estimatedDelivery?: Date;
	actualDelivery?: Date;
	cost?: number;
	deliveryNotes?: string;
	assignedDriver?: string;
	trackingNumber: string;
}

export interface Incident {
	id: string;
	orderId: string;
	title: string;
	description: string;
	severity: "low" | "medium" | "high";
	status: "open" | "in_progress" | "resolved";
	reportedBy: string;
	reportedAt: Date;
	resolvedAt?: Date;
	resolution?: string;
}

export interface DeliveryReport {
	id: string;
	orderId: string;
	completedAt: Date;
	cost: number;
	notes: string;
	customerSignature?: string;
	photos?: string[];
	driverName: string;
}

export interface NotificationData {
	id: string;
	type: "order_update" | "incident" | "delivery_complete" | "system";
	title: string;
	message: string;
	timestamp: Date;
	read: boolean;
	userId: string;
	orderId?: string;
}
