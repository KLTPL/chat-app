export default function DateMessage({ date }: { date: Date }) {
  const now = new Date();

  const isToday = now.toDateString() === date.toDateString();
  const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  if (!isToday && diffDays < 7) {
    options.weekday = "short";
  } else if (!isToday) {
    options.day = "numeric";
    options.month = "short";
    options.year = "numeric";
  }
  return (
    <div className="flex justify-center text-sm relative w-full my-3">
      <div className="-z-10 absolute w-full bg-black h-[1px] top-1/2 -translate-y-1/2"></div>
      <div className="bg-background px-1">
        {date.toLocaleString([], options)}
      </div>
    </div>
  );
}
