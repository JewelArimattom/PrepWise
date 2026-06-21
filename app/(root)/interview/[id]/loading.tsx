export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-screen"
      style={{ background: "#0C0714" }}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Spinner */}
        <div
          className="w-12 h-12 rounded-full"
          style={{
            border: "2px solid rgba(148,0,211,0.15)",
            borderTopColor: "#9400D3",
            animation: "spin 0.7s linear infinite",
          }}
        />
        {/* Brand */}
        <span className="text-sm text-white/40 tracking-widest uppercase font-medium">
          Prep<span className="text-[#ED80E9]">Wise</span>
        </span>
      </div>
    </div>
  );
}
