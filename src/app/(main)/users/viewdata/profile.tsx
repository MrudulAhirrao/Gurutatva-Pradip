"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Define a User type based on the fields you are fetching
interface User {
  FullName: string;
  Address: string;
  Mobno: string;
  EMobno: string;
  Age: number;
  Aadhaar: string;
  Gender: string;
  BloodGrp: string;
  disease: string;
  items?: string[]; // Optional array of strings
  rollingno: string;
  type: string;
}

export default function ProfileView() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Get the 'id' query parameter
  const [user, setUser] = useState<User | null>(null); // Use User type

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        // Fetch user data
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
        } else {
          console.log("Fetched user data:", data); // Log the whole user object
          setUser(data as User); // Explicitly cast data to User type
        }
      }
    };

    fetchUserData();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle>Profile Data</CardTitle>
      </CardHeader>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/0">
            <Card>
              <CardHeader>
                <CardTitle>Rolling Number</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{user.rollingno}</CardDescription>
              </CardContent>
            </Card>
          </div>
          <div className="aspect-video rounded-xl bg-muted/0">
            <Card>
              <CardHeader>
                <CardTitle>Full Name</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{user.FullName}</CardDescription>
              </CardContent>
            </Card>
          </div>
          <div className="aspect-video rounded-xl bg-muted/0">
            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{user.Address}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
        <Separator />
        <CardTitle>Other Basic details</CardTitle>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Mobile Number</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{user.Mobno}</CardDescription>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Emergency Mobile Number</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{user.EMobno}</CardDescription>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Age</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{user.Age}</CardDescription>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Aadhaar Number</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{user.Aadhaar}</CardDescription>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Gender</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{user.Gender}</CardDescription>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Blood Group</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{user.BloodGrp}</CardDescription>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Disease</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{user.disease}</CardDescription>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Stay</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{user.items?.join(", ")}</CardDescription>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{user.type}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Card>
  );
}
