import { type Metadata } from "next";
import Link from "next/link";
import SignUpForm from "./form";

export const metadata: Metadata = {
  title: "Зарегестрироваться",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-10">
      <div className="flex w-full flex-col rounded-2xl border border-foreground/10 px-8 py-5 md:w-96">
        <h1>Зарегестрироваться</h1>
        {/* <p>Example sign up page using Better Auth</p> */}
        <SignUpForm />
        <div className="flex items-center justify-center gap-2">
          <small>Уже есть аккаунт?</small>
          <Link href={"/signin"} className="text-sm font-bold leading-none">
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}
