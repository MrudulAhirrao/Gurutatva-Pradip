// page.tsx
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { supabase } from "@/lib/supabase";

// Fetching profiles from Supabase
async function getProfiles() {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }
}

export default async function User() {
  const profiles = await getProfiles();
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here a list of your tasks for this month!
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/users/form">+ ADD User</Link>
          </Button>
        </div>
      </div>
      <Separator />
      <DataTable columns={columns} data={profiles} />
    </div>
  );
}

