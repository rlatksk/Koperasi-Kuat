export default function StatusBadge({ status }: { status: string }) {
  if (status !== 'CANCELLED') return null;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
    >
      Dibatalkan
    </span>
  );
}
