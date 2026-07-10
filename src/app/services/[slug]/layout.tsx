import { PageTransition } from "@/components/PageTransition";

export default function ServiceSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition>{children}</PageTransition>;
}
