import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { getDictionary } from "@/lib/dictionaries";
import { toLocale } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = toLocale(lang);
  if (!locale) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return (
    <div className="min-h-screen bg-background">

      <section className="flex min-h-screen flex-col lg:flex-row">
        <div className="flex flex-1 flex-col justify-center px-8 pt-28 pb-12 md:px-16 lg:px-20 lg:pt-0 lg:pb-0">
          <p className="mb-6 text-sm font-medium tracking-widest text-primary uppercase">
            {dict.home.eyebrow}
          </p>
          <h1 className="mb-6 text-5xl leading-[1.05] font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            {dict.home.titleLine1}
            <br />
            {dict.home.titlePrefix}{" "}
            <span className="text-primary">{dict.home.titleHighlight}</span>
          </h1>
          <p className="mb-10 max-w-md text-lg leading-relaxed text-muted-foreground md:text-xl">
            {dict.home.subtitle}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${locale}/wallet`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-8 text-base font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              {dict.home.startNow} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/${locale}/`}
              className="inline-flex h-11 items-center justify-center rounded-md px-8 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {dict.home.learnMore}
            </Link>
          </div>
        </div>

        <div className="relative min-h-[50vh] flex-1 lg:min-h-screen hidden lg:block">
          <Image
            src="/hero-stars-image.jpg"
            alt={dict.home.heroAlt}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-background/60 to-transparent lg:hidden" />
        </div>
      </section>
    </div>
  );
}

