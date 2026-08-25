import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { getAllUsers } from "@/lib/services/userService";

const DashboardUsers = async () => {
  const users = await getAllUsers();

  return (
    <div className="flex justify-start max-w-screen-2xl mx-auto max-xl:flex-col max-xl:gap-y-4">

      <div className="w-full p-6">

        <Card>

          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">
              Все пользователи
            </CardTitle>

            <Link href="/admin/users/new">
              <Button>Добавить пользователя</Button>
            </Link>
          </CardHeader>

          <CardContent>
            <div className="overflow-auto">

              <Table>

                <TableHeader>
                  <TableRow>

                    <TableHead className="w-10">
                      <Checkbox />
                    </TableHead>

                    <TableHead>Email</TableHead>

                    <TableHead>Роль</TableHead>

                    <TableHead className="text-right" />

                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>

                      <TableCell>
                        <Checkbox />
                      </TableCell>

                      <TableCell>
                        {user.email}
                      </TableCell>

                      <TableCell>
                        {user.role}
                      </TableCell>

                      <TableCell className="text-right">
                        <Link href={`/admin/users/${user.id}`}>
                          <Button variant="ghost" size="sm">
                            детали
                          </Button>
                        </Link>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>

              </Table>

            </div>
          </CardContent>

        </Card>

      </div>
    </div>
  );
};

export default DashboardUsers;
