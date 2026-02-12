import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-25">
      <div className="flex items-center gap-3 text-gray-700">
        <Loader2 className="size-10 animate-spin text-blue-600" />
        <p className="text-15 font-medium">Loading...</p>
      </div>
    </div>
  );
}
