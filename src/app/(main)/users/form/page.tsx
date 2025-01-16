import { Separator } from "@/components/ui/separator";
import { Profileform } from "./profile-form";

export default function User() {
  return (
     <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
    <div className="flex items-center justify-between space-y-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
        This is how others will see you on the site.
        </p>
      </div>
    </div>
    <Separator/>
    <Profileform/>
  </div>
  );
}
