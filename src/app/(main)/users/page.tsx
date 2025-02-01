"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function User() {
  const [profiles, setProfiles] = useState<any[]>([]);

  // Fetch users from Supabase
  const fetchProfiles = async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error("Error fetching profiles:", error);
    } else {
      setProfiles(data);
    }
  };

  useEffect(() => {
    fetchProfiles(); // Initial data fetch

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("realtime-users")
      .on("postgres_changes", { event: "*", schema: "public", table: "users" }, fetchProfiles)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">Here is a list of your users!</p>
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
