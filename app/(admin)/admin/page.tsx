import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Package, ShoppingCart, Users, DollarSign, Plus, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
  // 1. Fetch Basic Counts
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();
  const totalUsers = await prisma.user.count();

  // 2. Fetch All Orders to Calculate True Revenue
  const allOrders = await prisma.order.findMany({
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  const totalRevenue = allOrders.reduce((acc, order) => {
    const orderTotal = order.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
    return acc + orderTotal;
  }, 0);

  // 3. Fetch the 5 Most Recent Orders for the Table
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      items: {
        include: { product: true },
      },
    },
  });

  return (
    <div className="flex-1 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>

        {/* Sales/Orders Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">Total orders placed</p>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active products in store</p>
          </CardContent>
        </Card>

        {/* Users Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-7">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                No recent orders.
              </div>
            ) : (
              <div className="space-y-6">
                {recentOrders.map((order) => {
                  // Calculate specific order total
                  const orderTotal = order.items.reduce(
                    (sum, item) => sum + Number(item.product.price) * item.quantity,
                    0
                  );

                  return (
                    <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="font-medium leading-none">{order.user.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{order.status}</Badge>
                        <div className="font-bold">
                          ₹{orderTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}