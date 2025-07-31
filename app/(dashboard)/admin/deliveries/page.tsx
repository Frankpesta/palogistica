"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, CheckCircle, Clock, Package } from "lucide-react"
import { mockOrders } from "@/lib/mock-data"
import type { Order, DeliveryReport } from "@/lib/types"
import { useGSAP } from "@/hooks/use-gsap"
import { toast } from "sonner"

export default function AdminDeliveriesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [deliveryReports, setDeliveryReports] = useState<DeliveryReport[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [deliveryForm, setDeliveryForm] = useState({
    cost: "",
    notes: "",
    customerSignature: "",
  })
  const containerRef = useGSAP()

  useEffect(() => {
    // Filter orders that are in progress or delivered
    const deliveryOrders = mockOrders.filter((order) => order.status === "in_progress" || order.status === "delivered")
    setOrders(deliveryOrders)
    setFilteredOrders(deliveryOrders)

    // Mock delivery reports
    const mockReports: DeliveryReport[] = [
      {
        id: "DEL-001",
        orderId: "ORD-002",
        completedAt: new Date("2024-01-15T14:45:00"),
        cost: 25.0,
        notes: "Delivered successfully to reception desk. Customer was satisfied.",
        customerSignature: "Alice Johnson",
        driverName: "Sarah Chen",
      },
    ]
    setDeliveryReports(mockReports)
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = orders.filter(
        (order) =>
          order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.assignedDriver?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredOrders(filtered)
    } else {
      setFilteredOrders(orders)
    }
  }, [searchTerm, orders])

  const handleCompleteDelivery = () => {
    if (!selectedOrder || !deliveryForm.cost || !deliveryForm.notes) return

    const newReport: DeliveryReport = {
      id: `DEL-${Date.now()}`,
      orderId: selectedOrder.id,
      completedAt: new Date(),
      cost: Number.parseFloat(deliveryForm.cost),
      notes: deliveryForm.notes,
      customerSignature: deliveryForm.customerSignature,
      driverName: selectedOrder.assignedDriver || "Unknown",
    }

    setDeliveryReports((prev) => [...prev, newReport])

    // Update order status
    setOrders((prev) =>
      prev.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              status: "delivered" as const,
              actualDelivery: new Date(),
              cost: Number.parseFloat(deliveryForm.cost),
              deliveryNotes: deliveryForm.notes,
            }
          : order,
      ),
    )

    toast(
      
      `Order ${selectedOrder.trackingNumber} has been marked as delivered.`,
    )

    setIsCompleteDialogOpen(false)
    setSelectedOrder(null)
    setDeliveryForm({ cost: "", notes: "", customerSignature: "" })
  }

  const inProgressOrders = filteredOrders.filter((order) => order.status === "in_progress")
  const completedOrders = filteredOrders.filter((order) => order.status === "delivered")

  const breadcrumbs = [{ label: "Admin Dashboard", href: "/admin" }, { label: "Deliveries" }]

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <div ref={containerRef} className="flex-1 space-y-4 p-4 pt-6">
        <div className="fade-in">
          <h2 className="text-3xl font-bold tracking-tight">Delivery Management</h2>
          <p className="text-muted-foreground">Track and complete deliveries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{inProgressOrders.length}</div>
              <p className="text-xs text-muted-foreground">Currently being delivered</p>
            </CardContent>
          </Card>

          <Card className="slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {
                  completedOrders.filter(
                    (order) =>
                      order.actualDelivery && order.actualDelivery.toDateString() === new Date().toDateString(),
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">Delivered today</p>
            </CardContent>
          </Card>

          <Card className="slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${deliveryReports.reduce((sum, report) => sum + report.cost, 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">From completed deliveries</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="slide-up">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search deliveries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* In Progress Deliveries */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle>In Progress Deliveries ({inProgressOrders.length})</CardTitle>
            <CardDescription>Orders currently being delivered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inProgressOrders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{order.trackingNumber}</h3>
                        <Badge variant="outline">{order.assignedDriver}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p>
                            <strong>Customer:</strong> {order.customerName}
                          </p>
                          <p>
                            <strong>Phone:</strong> {order.customerPhone}
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Delivery Address:</strong> {order.deliveryAddress}
                          </p>
                          <p>
                            <strong>Est. Delivery:</strong> {order.estimatedDelivery?.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedOrder(order)
                        setIsCompleteDialogOpen(true)
                      }}
                    >
                      Complete Delivery
                    </Button>
                  </div>
                </div>
              ))}
              {inProgressOrders.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No deliveries in progress</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Completed Deliveries */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle>Recent Completed Deliveries</CardTitle>
            <CardDescription>Recently completed delivery reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveryReports.map((report) => {
                const order = mockOrders.find((o) => o.id === report.orderId)
                return (
                  <div key={report.id} className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold">{order?.trackingNumber}</h3>
                        <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${report.cost.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">
                          {report.completedAt.toLocaleDateString()} at {report.completedAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <strong>Customer:</strong> {order?.customerName}
                        </p>
                        <p>
                          <strong>Driver:</strong> {report.driverName}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Signature:</strong> {report.customerSignature || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p>
                        <strong>Notes:</strong> {report.notes}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Complete Delivery Dialog */}
        <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Delivery</DialogTitle>
              <DialogDescription>Mark this delivery as completed and provide final details.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cost">Delivery Cost ($) *</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  placeholder="25.00"
                  value={deliveryForm.cost}
                  onChange={(e) => setDeliveryForm((prev) => ({ ...prev, cost: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="notes">Delivery Notes *</Label>
                <Textarea
                  id="notes"
                  placeholder="Delivery completed successfully..."
                  value={deliveryForm.notes}
                  onChange={(e) => setDeliveryForm((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="signature">Customer Signature</Label>
                <Input
                  id="signature"
                  placeholder="Customer name or signature"
                  value={deliveryForm.customerSignature}
                  onChange={(e) => setDeliveryForm((prev) => ({ ...prev, customerSignature: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCompleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCompleteDelivery} disabled={!deliveryForm.cost || !deliveryForm.notes}>
                  Complete Delivery
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
