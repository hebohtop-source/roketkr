"use client";

import React, { useState, useTransition } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { createUser } from "@/lib/services/userService";

const createUserSchema = z.object({
  email: z.string().email("Неверный формат email"),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
  role: z.enum(["admin", "user"]),
  name: z.string().min(1, "Имя обязательно"),
});

type CreateUserInput = z.infer<typeof createUserSchema>;

const DashboardCreateNewUser = () => {
  const [isPending, startTransition] = useTransition();

  const [userInput, setUserInput] = useState<CreateUserInput>({
    email: "",
    password: "",
    role: "user",
    name: "",
  });

  const addNewUser = async () => {
    const result = createUserSchema.safeParse(userInput);

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    startTransition(async () => {
      try {
        await createUser(result.data);
        toast.success("Пользователь успешно создан");

        setUserInput({
          email: "",
          password: "",
          role: "user",
          name: "",
        });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Ошибка при создании пользователя";

        toast.error(message);
      }
    });
  };

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">

      <div className="flex flex-col gap-y-7 xl:pl-5 max-xl:px-5 w-full">

        <h1 className="text-3xl font-semibold">
          Добавить пользователя
        </h1>

        {/* Name */}
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Имя:</span>
          </div>

          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={userInput.name}
            onChange={(e) =>
              setUserInput({
                ...userInput,
                name: e.target.value,
              })
            }
          />
        </label>

        {/* Email */}
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Email:</span>
          </div>

          <input
            type="email"
            className="input input-bordered w-full max-w-xs"
            value={userInput.email}
            onChange={(e) =>
              setUserInput({
                ...userInput,
                email: e.target.value,
              })
            }
          />
        </label>

        {/* Password */}
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Пароль:</span>
          </div>

          <input
            type="password"
            className="input input-bordered w-full max-w-xs"
            value={userInput.password}
            onChange={(e) =>
              setUserInput({
                ...userInput,
                password: e.target.value,
              })
            }
          />
        </label>

        {/* Role */}
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Роль:</span>
          </div>

          <select
            className="select select-bordered"
            value={userInput.role}
            onChange={(e) =>
              setUserInput({
                ...userInput,
                role: e.target.value as "admin" | "user",
              })
            }
          >
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
        </label>

        <button
          type="button"
          disabled={isPending}
          onClick={addNewUser}
          className="uppercase bg-blue-500 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 disabled:opacity-50"
        >
          {isPending ? "Создание..." : "Создать пользователя"}
        </button>

      </div>
    </div>
  );
};

export default DashboardCreateNewUser;
