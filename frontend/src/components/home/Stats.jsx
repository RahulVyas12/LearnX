// =============================================================
//  Stats.jsx — Key platform statistics strip
//  Displayed between sections on the landing page.
// =============================================================

const STATS = [
    { label: 'Active Learners', value: '10,000' },
    { label: 'Skill Paths', value: '50+' },
    { label: 'Success Rate', value: '92%' },
    { label: 'Job Placements', value: '2,500+' },
];

const Stats = () => {
    return (
        <section className="border-y border-slate-100 bg-white/50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="group text-center">
                            <div className="mb-1 text-3xl font-black text-primary transition-transform duration-300 group-hover:scale-110 lg:text-4xl">
                                {stat.value}
                            </div>
                            <div className="text-xs font-bold uppercase leading-tight tracking-widest text-slate-500">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
