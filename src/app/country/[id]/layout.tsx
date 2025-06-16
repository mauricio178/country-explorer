import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function DynamicLayout({ children }: Props) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
