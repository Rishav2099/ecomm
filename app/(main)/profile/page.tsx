import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireAuth } from "@/lib/auth-utils";
import { SignOutButton } from "@/components/sign-out-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function getStatusBadge(status: string) {
  switch (status.toUpperCase()) {
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
        >
          Pending
        </Badge>
      );
    case "PROCESSING":
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 text-blue-600 border-blue-500/20"
        >
          Processing
        </Badge>
      );
    case "SHIPPED":
      return (
        <Badge
          variant="outline"
          className="bg-purple-500/10 text-purple-600 border-purple-500/20"
        >
          Shipped
        </Badge>
      );
    case "DELIVERED":
      return (
        <Badge
          variant="outline"
          className="bg-green-500/10 text-green-600 border-green-500/20"
        >
          Delivered
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export default async function ProfilePage() {
  await requireAuth();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const sessionUserId = session?.user?.id;

  const user = await prisma.user.findUnique({
    where: { id: sessionUserId },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: { product: true },
          },
        },
      },
    },
  });

  if (!user) return <div>User not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl space-y-10">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b pb-8">
        <div className="flex items-center gap-5">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold uppercase overflow-hidden relative border-4 border-background shadow-sm">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                fill
                className="object-cover"
              />
            ) : (
              user.name.charAt(0)
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground font-medium">{user.email}</p>
            {user.role === "admin" && (
              <Badge className="mt-2" variant="default">
                Admin Account
              </Badge>
            )}
          </div>
        </div>

        <SignOutButton />
      </div>

      {/* Order History */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          Order History
        </h2>

        {user.orders.length === 0 ? (
          <Card className="border-dashed bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">No orders yet</h3>
                <p className="text-muted-foreground max-w-sm">
                  When you place an order, its status and details will appear
                  here.
                </p>
              </div>
              <Button asChild className="mt-4">
                <Link href="/">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {user.orders.map((order) => {
              const orderTotal = order.items.reduce(
                (sum, item) => sum + Number(item.product.price) * item.quantity,
                0,
              );

              return (
                <Card key={order.id} className="overflow-hidden shadow-sm py-0">
                  <CardHeader className="bg-muted/40 border-b py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">
                          Order #{order.id}
                        </CardTitle>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm text-muted-foreground mb-0.5">
                        Total Amount
                      </p>
                      <p className="font-bold text-xl tracking-tight text-foreground">
                        ₹
                        {orderTotal.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </CardHeader>

                  {/* Order Items */}
                  <CardContent className="p-0">
                    <div className="divide-y divide-border/50">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-5 hover:bg-muted/10 transition-colors"
                        >
                          <div className="h-20 w-20 relative rounded-md bg-muted overflow-hidden flex-shrink-0 border border-border/50">
                            <Image
                              src={item.product.image || "/placeholder.png"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <div className="space-y-1">
                              <p className="font-semibold text-base line-clamp-1">
                                {item.product.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-medium text-foreground">
                              ₹
                              {(
                                Number(item.product.price) * item.quantity
                              ).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
