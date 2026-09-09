export default function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink md:text-[1.7rem]">{title}</h1>
        {description && <p className="mt-1.5 text-[14.5px] text-ink/55">{description}</p>}
      </div>
      {action}
    </div>
  );
}
