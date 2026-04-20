import { updateUserRole } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export function UserRoleForm({
  userId,
  role
}: {
  userId: string;
  role: "USER" | "ADMIN";
}) {
  return (
    <form action={updateUserRole} className="flex items-center gap-3">
      <input type="hidden" name="userId" value={userId} />
      <Select name="role" defaultValue={role} className="min-w-36">
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </Select>
      <Button type="submit" variant="outline">
        Shrani
      </Button>
    </form>
  );
}
