"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProfileView from "./profile";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// Define a type for the user data
interface User {
  FullName: string;
}

export default function ViewData() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); 
  const [user, setUser] = useState<User | null>(null); // Use the User type

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("FullName")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
        } else {
          console.log("Fetched user data:", data);
          setUser(data as User); // Explicitly cast data to the User type
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    if (id) fetchUser(); // Only fetch if ID is present
  }, [id]);

  const handlePrintData = () => {
    const element = document.getElementById("printable-content"); // ID of the content to print

    if (element) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL("image/png"); // Convert content to image
        const pdf = new jsPDF("p", "mm", "a4"); // Create a new PDF

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate height to maintain aspect ratio

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight); // Add image to PDF
        pdf.save("profile-data.pdf"); // Save the PDF
      });
    }
  };

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here is a user {user?.FullName ?? "unknown"} data.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handlePrintData}>Print Data</Button>
        </div>
      </div>
      <Separator />
      {/* Add an ID to the content you want to print */}
      <div id="printable-content">
        <ProfileView />
      </div>
    </div>
  );
}
