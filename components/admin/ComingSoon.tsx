import { Construction } from "lucide-react";
import PageHeader from "./PageHeader";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div>
      <PageHeader title={title} />
      <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 bg-white px-6 py-20 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-offwhite text-ink/40">
          <Construction size={20} strokeWidth={1.6} />
        </span>
        <p className="mt-4 text-[14.5px] font-medium text-ink/55">
          {title} management is coming in a later update.
        </p>
      </div>
    </div>
  );
}
