import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { createClient } from "@/src/lib/supabase-server";
import { cn } from "@/lib/utils";
import {
  ImageIcon,
  Film,
  Code2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const HERO_TITLE = "The Global Prompt Architecture";
const HERO_SUBTITLE =
  "Verified prompt assets on the Nexus Core—visual, cinematic, logic, and autonomous workflows.";
const MODALITY_LABELS: Record<string, string> = {
  visual: "Visual",
  cinematic: "Cinematic",
  logic: "Logic",
  autonomous: "Autonomous",
};
const MODALITY_ICONS: Record<string, LucideIcon> = {
  visual: ImageIcon,
  cinematic: Film,
  logic: Code2,
  autonomous: Sparkles,
};
const PROMPT_PREVIEW_LENGTH = 120;
const EMPTY_TITLE = "No prompts verified yet";
const EMPTY_DESCRIPTION = "Be the first to add a verified prompt from the Creator Dashboard.";
const EMPTY_CTA = "Go to Dashboard";
const VIEW_DETAILS = "View Details";

function shortenPrompt(text: string | null): string {
  if (!text || !text.trim()) return "";
  const trimmed = text.trim();
  if (trimmed.length <= PROMPT_PREVIEW_LENGTH) return trimmed;
  return trimmed.slice(0, PROMPT_PREVIEW_LENGTH).trim() + "…";
}

export default async function HomePage() {
  const supabase = await createClient();
  const { data: prompts, error } = await supabase
    .from("prompts")
    .select("id, title, slug, modality, user_prompt_template, preview_url")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch prompts:", error.message);
  }

  const list = Array.isArray(prompts) ? prompts : [];

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white">
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="mb-12 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {HERO_TITLE}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/60 sm:text-base">
            {HERO_SUBTITLE}
          </p>
        </section>

        {list.length === 0 ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center rounded-xl border border-white/10 bg-[#0a0a0a]/50 py-16 px-6 text-center"
            )}
          >
            <p className="text-lg font-medium text-white">{EMPTY_TITLE}</p>
            <p className="mt-2 max-w-sm text-sm text-white/60">
              {EMPTY_DESCRIPTION}
            </p>
            <Link
              href="/dashboard"
              className={cn(
                "mt-6 inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-[#050505] transition-colors hover:bg-white/90"
              )}
            >
              {EMPTY_CTA}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((prompt) => {
              const ModalityIcon = MODALITY_ICONS[prompt.modality] ?? Sparkles;
              return (
                <Card
                  key={prompt.id}
                  className={cn(
                    "overflow-hidden border-white/10 bg-[#0a0a0a] shadow-none transition-colors hover:border-white/15"
                  )}
                >
                  <CardHeader className="p-0">
                    <div className="relative aspect-video w-full bg-white/5">
                      {prompt.preview_url ? (
                        <Image
                          src={prompt.preview_url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-white/30">
                          <ImageIcon className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 p-4 pb-0">
                      <span
                        className={cn(
                          "inline-flex w-fit items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-white/90"
                        )}
                      >
                        <ModalityIcon className="h-3.5 w-3.5" />
                        {MODALITY_LABELS[prompt.modality] ?? prompt.modality}
                      </span>
                      <h2 className="line-clamp-2 text-base font-semibold leading-snug text-white">
                        {prompt.title}
                      </h2>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pt-2">
                    <p className="line-clamp-3 text-sm text-white/60">
                      {shortenPrompt(prompt.user_prompt_template)}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Link
                      href={`/prompts/${prompt.slug}`}
                      className={cn(
                        "inline-flex h-9 items-center justify-center rounded-md border border-white/10 bg-white/5 px-3 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {VIEW_DETAILS}
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
