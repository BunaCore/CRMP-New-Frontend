import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SidebarSupportCard() {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-r from-sky-600 to-emerald-500 shadow-none group-data-[collapsible=icon]:hidden">
      <CardHeader className="space-y-0 p-2.5 text-white">
        <CardTitle className="font-bold text-white text-xs">Looking for something?</CardTitle>
        <CardDescription className="text-[10px] text-white/80 leading-snug">
          Reach out if you need help or have ideas.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
