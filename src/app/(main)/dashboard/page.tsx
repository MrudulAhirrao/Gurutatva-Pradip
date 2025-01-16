
"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Component } from "./component";
import { Components } from "./components";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch the total number of registered users from Supabase
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const { count, error } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true });

        if (error) {
          throw error;
        }

        setTotalUsers(count || 0);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    fetchTotalUsers();
  }, []);

  return (
    <div className="container">
      <SidebarProvider>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block"></BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>DashBoard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/0">
                <Card>
                  <CardHeader>
                    <CardTitle>Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Registered User</CardDescription>
                    <CardDescription>{totalUsers}</CardDescription>
                  </CardContent>
                </Card>
              </div>
              <div className="aspect-video rounded-xl bg-muted/0">
                <Card>
                  <CardHeader>
                    <CardTitle>Room Allocated</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Allocated Rooms to User</CardDescription>
                    <CardDescription>250+</CardDescription>
                  </CardContent>
                </Card>
              </div>
              <div className="aspect-video rounded-xl bg-muted/0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Notification</CardDescription>
                    <CardDescription>250+</CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <Component />
              </div>
              <div className="col-span-4 md:col-span-3">
                <Components />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}