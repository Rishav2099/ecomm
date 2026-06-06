import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, LogOut } from "lucide-react";
import Image from "next/image";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; // Adjust path to your auth.ts
import { requireAuth } from "@/lib/auth-utils"; // Adjust path to your helpers
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  // 1. Ensure the user is logged in; if not, they are redirected to /login
  await requireAuth();

  // 2. Fetch the active session securely
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const sessionUserId = session?.user?.id;

  // 3. Fetch the user's specific order history from Prisma
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
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl space-y-8">
      {/* Profile Header */}
      <div className="flex items-center justify-between border-b pb-8">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold uppercase overflow-hidden relative">
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            {user.role === "admin" && (
              <Badge className="mt-2" variant="default">
                Admin Account
              </Badge>
            )}
          </div>
        </div>

        {/* Placeholder for Client-side Sign Out Button */}
        <Button variant="outline" className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* Order History */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" />
          Order History
        </h2>

        {user.orders.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center text-muted-foreground">
              You haven't placed any orders yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {user.orders.map((order) => {
              const orderTotal = order.items.reduce(
                (sum, item) => sum + Number(item.product.price) * item.quantity,
                0,
              );

              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b pb-4 flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="text-base">
                        Order #{order.id}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ₹{orderTotal.toFixed(2)}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4"
                        >
                          <div className="h-16 w-16 relative rounded bg-muted overflow-hidden flex-shrink-0">
                            <Image
                              src={item.product.image || "/placeholder.png"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {item.product.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} x ₹
                              {Number(item.product.price).toFixed(2)}
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
