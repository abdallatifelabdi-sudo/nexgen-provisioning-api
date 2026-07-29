export default function ProfessionalFeatureGrid() {
  const features = [
    {
      step: "01",
      title: "Real-Time Leak Detection",
      description: "Instantly scan your operational databases and sales pipelines to quantify precise revenue leakages in seconds."
    },
    {
      step: "02",
      title: "Autonomous Outreach Engine",
      description: "Deploy hyper-personalized automated email sequences targeting high-value decision-makers on a weekly autopilot."
    },
    {
      step: "03",
      title: "Frictionless Conversion",
      description: "Convert high-intent prospects directly into scheduled strategy calls with integrated, lightning-fast webhooks."
    }
  ]

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((item, index) => (
          <div 
            key={index} 
            className="relative p-8 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-blue-500/50 transition-all duration-300 shadow-xl group backdrop-blur-sm"
          >
            <div className="absolute top-6 right-6 text-4xl font-black text-neutral-800 group-hover:text-blue-500/20 transition-colors">
              {item.step}
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold mb-6">
              {item.step}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
              {item.title}
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
