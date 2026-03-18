export default function Loading() {
  return (
    <div
      className="flex items-center justify-center min-h-screen w-full"
      style={{ background: "#020617" }}
    >
      <div className="flex flex-col items-center gap-5">
        <div
          className="w-12 h-12 rounded-full"
          style={{
            border: "2px solid rgba(96,165,250,0.15)",
            borderTopColor: "#60a5fa",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <span className="text-sm text-white/40 tracking-widest uppercase font-medium">
          Prep<span className="text-blue-400">Wise</span>
        </span>
      </div>
    </div>
  );
}
