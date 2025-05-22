import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex justify-center flex-col font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          src="/images/app-logo/large-app-logo.png"
          className="rounded-full self-center mt-[30vh]"
          alt="app-logo"
          width={200}
          height={200}
        />
      </main>
      <div className="flex flex-col justify-center gap-4 mt-10">
        <Link href="/login" className="self-center">
          Log in
        </Link>
        <Link href="/register" className="self-center">
          New Account
        </Link>
      </div>
    </div>
  );
}
