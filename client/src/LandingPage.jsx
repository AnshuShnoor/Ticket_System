function BrandMark() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-lg shadow-indigo-200">
      S
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path d="M4.167 10h11.666M10 4.167 15.833 10 10 15.833" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LandingPage({ onLogin, onSignup }) {
  return (
    <div className="min-h-screen bg-[#fbfcff] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#home" className="flex items-center gap-3" aria-label="SupportDesk home">
            <BrandMark />
            <span className="text-lg font-bold tracking-tight">SupportDesk</span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 transition hover:text-indigo-600">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 transition hover:text-indigo-600">How it works</a>
            <a href="#teams" className="text-sm font-medium text-slate-600 transition hover:text-indigo-600">For teams</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button type="button" onClick={onLogin} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:px-4">
              Log in
            </button>
            <button type="button" onClick={onSignup} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200">
              Sign up
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="relative isolate overflow-hidden">
          <div aria-hidden="true" className="absolute -right-36 -top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-indigo-100/70 blur-3xl" />
          <div aria-hidden="true" className="absolute -left-48 top-72 -z-10 h-96 w-96 rounded-full bg-cyan-100/50 blur-3xl" />
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 pb-16 pt-12 sm:gap-14 sm:px-8 sm:pb-20 sm:pt-24 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:pb-28 lg:pt-24">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3.5 py-2 text-xs font-semibold text-indigo-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                A calmer way to handle customer support
              </div>
              <h1 className="mt-6 text-[2.65rem] font-bold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:mt-7 sm:text-6xl lg:text-[4.25rem]">
                Great support starts with
                <span className="text-indigo-600"> every ticket.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
                Bring customer questions, team conversations, and resolutions into one simple workspace. Nothing slips through the cracks.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
                <button type="button" onClick={onSignup} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700">
                  Get started <ArrowIcon />
                </button>
                <a href="#features" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                  Explore features
                </a>
              </div>
              <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
                <div className="flex -space-x-2" aria-hidden="true">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#fbfcff] bg-amber-200 text-[10px] font-bold text-amber-800">JD</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#fbfcff] bg-cyan-200 text-[10px] font-bold text-cyan-800">AL</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#fbfcff] bg-violet-200 text-[10px] font-bold text-violet-800">MK</span>
                </div>
                <span>One clear view for your whole support team</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[610px]">
              <div aria-hidden="true" className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-indigo-200/60 via-white to-cyan-100/70 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_32px_90px_-38px_rgba(47,54,102,0.38)]">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <BrandMark />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Team overview</p>
                      <p className="text-xs text-slate-500">A snapshot of your queue</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">● All systems go</span>
                </div>
                <div className="grid grid-cols-3 gap-2 bg-slate-50/70 p-3 sm:gap-4 sm:p-5">
                  <div className="rounded-xl border border-slate-100 bg-white p-3 sm:p-4">
                    <p className="text-xs font-medium text-slate-500">Open tickets</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight">24</p>
                    <p className="mt-1 text-[11px] font-medium text-emerald-600">↓ 12% this week</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white p-3 sm:p-4">
                    <p className="text-xs font-medium text-slate-500">In progress</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight">08</p>
                    <p className="mt-1 text-[11px] font-medium text-indigo-600">With your team</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white p-3 sm:p-4">
                    <p className="text-xs font-medium text-slate-500">Resolved</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight">136</p>
                    <p className="mt-1 text-[11px] font-medium text-emerald-600">↑ 18% this week</p>
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-800">Recent tickets</h2>
                    <span className="text-xs font-semibold text-indigo-600">View all →</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    <div className="flex items-center gap-3 py-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-sm font-bold text-violet-600">P</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">Unable to update my profile</p>
                        <p className="mt-1 text-xs text-slate-500">Priya S. · 12 min ago</p>
                      </div>
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700 sm:text-xs">Open</span>
                    </div>
                    <div className="flex items-center gap-3 py-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-sm font-bold text-cyan-700">J</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">Question about my recent order</p>
                        <p className="mt-1 text-xs text-slate-500">Jordan T. · 38 min ago</p>
                      </div>
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700 sm:text-xs">In progress</span>
                    </div>
                    <div className="flex items-center gap-3 py-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-sm font-bold text-rose-600">A</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">Can’t access my account</p>
                        <p className="mt-1 text-xs text-slate-500">Alex R. · 1 hour ago</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 sm:text-xs">Resolved</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 border-t border-slate-100 bg-white px-5 py-4">
                  <div className="flex -space-x-2" aria-hidden="true">
                    <span className="h-7 w-7 rounded-full border-2 border-white bg-amber-200" />
                    <span className="h-7 w-7 rounded-full border-2 border-white bg-cyan-200" />
                    <span className="h-7 w-7 rounded-full border-2 border-white bg-violet-200" />
                  </div>
                  <p className="text-xs text-slate-500"><span className="font-semibold text-slate-700">Your team, in sync.</span> Every update in one place.</p>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-xl sm:flex">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-lg text-emerald-600">✓</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">Ticket resolved</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">Nice work, team!</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-slate-100 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">Everything in one place</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Less juggling. More helping.</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">Give customers a smoother experience and your team a clearer way to get there.</p>
            </div>
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/60">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600">▤</span>
                <h3 className="mt-5 text-lg font-bold">Every ticket, organized</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Capture requests in one queue, set priorities, and see exactly what needs attention.</p>
              </article>
              <article className="rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-100/60">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-xl text-cyan-700">↗</span>
                <h3 className="mt-5 text-lg font-bold">A team that stays in sync</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Assign tickets to the right people and follow conversations through to resolution.</p>
              </article>
              <article className="rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/60">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-700">⌁</span>
                <h3 className="mt-5 text-lg font-bold">Know what’s happening</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Track status and ticket activity so customers and teammates aren’t left guessing.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">Simple by design</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">From first message to solved.</h2>
              <p className="mt-4 max-w-xl leading-7 text-slate-600">A straightforward workflow keeps customers informed and helps your team focus on the next best action.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">01 / Submit</span>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-800">Customers create a ticket with the details that matter.</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">02 / Resolve</span>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-800">Agents collaborate, update status, and keep the conversation moving.</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">03 / Improve</span>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-800">Admins get a clear view of workload and team progress.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="teams" className="px-5 pb-20 sm:px-8 sm:pb-24">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-950 px-7 py-12 text-center sm:px-12 sm:py-16">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-300">Built for better support</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">Make every customer feel heard.</h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">Get your team and customers on the same page, starting with your next ticket.</p>
            <button type="button" onClick={onSignup} className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-indigo-50">
              Create your account <ArrowIcon />
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <a href="#home" className="flex items-center gap-2.5">
            <BrandMark />
            <span className="font-bold tracking-tight">SupportDesk</span>
          </a>
          <p className="text-sm text-slate-500">Customer support, made simpler.</p>
          <div className="flex gap-5 text-sm font-medium text-slate-500">
            <a href="#features" className="transition hover:text-indigo-600">Features</a>
            <button type="button" onClick={onLogin} className="transition hover:text-indigo-600">Log in</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
