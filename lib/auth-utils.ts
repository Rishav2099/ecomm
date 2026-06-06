import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }
};

export const requireUnauth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }
};

export const requireAdmin = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if(!session || session.user.role !== 'admin'){
        redirect('/')
    }
}