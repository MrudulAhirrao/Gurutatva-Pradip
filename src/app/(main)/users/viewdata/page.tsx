"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProfileView from "./profile";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface User {
  FullName: string;
  Address: string;
  Mobno: string;
  EMobno: string;
  Age: number;
  Gender: string;
  Email: string;
  Username: string;
  Password: string;
  ProfilePicture: string;
  Aadhaar: string;
  BloodGrp: string;
  disease: string;
  rollingno: string;
  type: string;
}

export default function ViewData() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("FullName")
          .eq("id", id)
          .single();

        if (error) {
          setError("Failed to fetch user data.");
          console.error("Error fetching user data:", error);
        } else {
          setUser(data as User);
        }
      } catch (err) {
        setError("Unexpected error occurred.");
        console.error("Unexpected error:", err);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handlePrintData = () => {
    const element = document.getElementById("printable-content");

    if (element) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("profile-data.pdf");
      });
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!id) {
    return <p>No user ID provided in the URL.</p>;
  }

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here is user {user?.FullName ?? "unknown"}&rsquo;s data.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handlePrintData}>Print Data</Button>
        </div>
      </div>
      <Separator />
      <div id="printable-content">
        <ProfileView user={user} />
      </div>
    </div>
  );
}
