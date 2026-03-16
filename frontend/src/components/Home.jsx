const reasons = [
  {
    title: "Expert Instructors",
    description:
      "Learn from practitioners who teach current, production-ready skills.",
  },
  {
    title: "Flexible Learning",
    description:
      "Pick up lessons, resources, and guided exercises at your pace.",
  },
  {
    title: "Progress Tracking",
    description:
      "Stay on track with simple milestones and course completion paths.",
  },
];

function Home() {
  return (
    <main className="bg-[linear-gradient(180deg,#f8fafc_0%,#eef4ff_48%,#f8fafc_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="w-full">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 text-center lg:flex-row lg:items-start">
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-[-0.03em] text-slate-950 sm:text-5xl">
                Master In-Demand Skills with SkillStream
              </h1>
              <p className="mt-4 text-lg leading-6 text-slate-600">
                Unlock your potential with our expert-led courses, hands-on
                projects, and personalized learning paths. Join SkillStream
                today and start your journey to success!
              </p>
              <a
                href="#"
                className="mt-6 inline-block rounded-full bg-[#0066cc] px-5 py-3 text-sm font-semibold text-white hover:bg-[#004499] transition-colors"
              >
                Get Started
              </a>
            </div>
            <div className="flex-1">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPsXws6n12v-lOKhwHS0uOEhrH8-6mveLm8w&s"
                alt="Hero Image"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </section>

        <aside className="w-full">
          <section className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-[0_24px_60px_rgba(15,23,42,0.07)]">
            <h2 className="mb-4 text-2xl font-black tracking-[-0.03em] text-slate-950">
              Why SkillStream?
            </h2>
            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-3">
              {reasons.map((reason) => (
                <article
                  key={reason.title}
                  className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-5 text-center shadow-sm"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6f1ff] text-sm font-black uppercase tracking-[0.18em] text-[#1f7ab8]">
                    {reason.title.slice(0, 2)}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {reason.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {reason.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default Home;
