
function HeaderBtn() {
  return (
    <div className="flex items-center justify-between border-b border-slate-700/40 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 px-4 py-3 text-slate-100 sm:px-8">
      <div className="ml-1 sm:ml-3">
        <h1 className="cursor-pointer text-xl font-extrabold tracking-[0.16em] sm:text-2xl">MARCINO</h1>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        <button className="rounded-lg border border-pink-400/70 px-4 py-1.5 text-sm font-semibold tracking-wide text-slate-100 transition hover:-translate-x-2 hover:-translate-y-0.5 hover:bg-linear-to-r from-red-200 to-purple-300 hover:bg-pink-400 hover:text-slate-900 sm:px-5 sm:py-2 sm:text-base">
          LOGIN
        </button>
      </div>
    </div>
  )
}

export default HeaderBtn