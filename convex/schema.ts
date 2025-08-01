import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
	...authTables,
	users: defineTable({
		name: v.string(),
		email: v.string(),
		role: v.union(v.literal("client"), v.literal("palogistica")),
		companyId: v.optional(v.string()),
		companyName: v.optional(v.string()),
		avatar: v.optional(v.string()),
		createdAt: v.number(), // storing as timestamp (ms) for simplicity
		updatedAt: v.number(),
	})
		.index("by_role", ["role"])
		.index("by_company", ["companyId"])
		.index("by_email", ["email"]),

	orders: defineTable({
		companyId: v.string(),
		companyName: v.string(),
		customerName: v.string(),
		customerPhone: v.string(),
		customerEmail: v.string(),
		pickupAddress: v.string(),
		deliveryAddress: v.string(),
		packageDetails: v.string(),
		weight: v.number(),
		dimensions: v.string(),
		specialInstructions: v.optional(v.string()),
		status: v.union(
			v.literal("pending"),
			v.literal("confirmed"),
			v.literal("in_progress"),
			v.literal("delivered"),
			v.literal("issue_reported")
		),
		trackingNumber: v.string(),
		createdAt: v.number(),
		updatedAt: v.number(),
		estimatedDelivery: v.optional(v.number()),
		actualDelivery: v.optional(v.number()),
		cost: v.optional(v.number()),
		deliveryNotes: v.optional(v.string()),
		assignedDriver: v.optional(v.string()),
		placedByUserId: v.string(),
	})
		.index("by_company", ["companyId"])
		.index("by_status", ["status"])
		.index("by_trackingNumber", ["trackingNumber"])
		.index("by_customerPhone", ["customerPhone"])
		.index("by_assignedDriver", ["assignedDriver"]),

	incidents: defineTable({
		orderId: v.string(),
		title: v.string(),
		description: v.string(),
		severity: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
		status: v.union(
			v.literal("open"),
			v.literal("in_progress"),
			v.literal("resolved")
		),
		reportedBy: v.string(),
		reportedAt: v.number(),
		resolvedAt: v.optional(v.number()),
		resolution: v.optional(v.string()),
	})
		.index("by_order", ["orderId"])
		.index("by_status", ["status"])
		.index("by_severity", ["severity"])
		.index("by_reportedBy", ["reportedBy"]),

	deliveryReports: defineTable({
		orderId: v.string(),
		completedAt: v.number(),
		cost: v.number(),
		notes: v.string(),
		driverName: v.string(),
		customerSignature: v.optional(v.string()),
		photos: v.optional(v.array(v.string())),
	})
		.index("by_order", ["orderId"])
		.index("by_completedAt", ["completedAt"])
		.index("by_driverName", ["driverName"]),

	notifications: defineTable({
		userId: v.string(),
		type: v.union(
			v.literal("order_update"),
			v.literal("incident"),
			v.literal("delivery_complete"),
			v.literal("system")
		),
		title: v.string(),
		message: v.string(),
		timestamp: v.number(),
		read: v.boolean(),
		orderId: v.optional(v.string()),
	})
		.index("by_user", ["userId"])
		.index("by_read", ["read"])
		.index("by_timestamp", ["timestamp"])
		.index("by_orderId", ["orderId"]),

	products: defineTable({
		companyId: v.string(),
		name: v.string(),
		description: v.optional(v.string()),
		sku: v.string(),
		price: v.optional(v.number()),
		createdAt: v.number(),
		updatedAt: v.optional(v.number()),
	})
		.index("by_company", ["companyId"])
		.index("by_sku", ["sku"]),
});
