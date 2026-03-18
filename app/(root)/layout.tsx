import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

import { getCurrentUser, signOut } from "@/lib/actions/auth.action";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Layout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();

  return (
    <div className="root-layout">
      <Navbar userName={user?.name} signOutAction={signOut} />

      <main className="flex flex-col gap-12">{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;
