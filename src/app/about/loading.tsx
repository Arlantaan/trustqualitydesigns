export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-20 w-20 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent"></div>
        <p className="mt-6 text-red-400 text-xl font-semibold">Loading...</p>
      </div>
    </div>
  );
}
