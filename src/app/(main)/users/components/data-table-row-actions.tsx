import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; // Import Supabase client
import { toast } from "react-toastify"; // Import toast notification component (optional)

// Define types for the row prop based on the data you're working with
interface UserRow {
  original: {
    id: string; // Assuming the row has a unique id
  };
}

export function DataTableRowActions({ row }: { row: UserRow }) {
  const userId = row.original.id;

  const handleDeleteUser = async () => {
    try {
      const {error } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);

      if (error) {
        throw error;
      }

      toast.success("User deleted successfully!"); // Display toast notification (optional)
      // You can also refresh the data table or redirect to a different page here
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user!"); // Display toast notification (optional)
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0">
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/users/viewdata?id=${userId}`}>View</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDeleteUser}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
