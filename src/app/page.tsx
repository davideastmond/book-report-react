import { LandingPageLinks } from "@/components/landing-page-links/Landing-page-links";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex justify-center flex-col font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Link href="/dashboard" className="self-center">
          <Image
            src="/images/app-logo/large-app-logo.png"
            className="rounded-full self-center mt-[30vh]"
            alt="app-logo"
            width={200}
            height={200}
          />
        </Link>
      </main>
      <LandingPageLinks />
    </div>
  );
}
