import { Check } from 'lucide-react'

const tiers = [
  {
    name: 'Revenue Discovery',
    price: 'Assessment',
    description: 'Quantify your hidden pipeline leakages with surgical precision.',
    features: [
      'Full Database Scan (Up to 10k)',
      'Lost Revenue Calculation',
      '1-1 Strategy Call (30 Min)',
      'Executive Summary PDF',
    ],
    buttonText: 'Book Discovery',
    highlighted: false,
  },
  {
    name: 'Accelerator System',
    price: 'Implementation',
    description: 'Deploy our automated engine to plug leaks and drive growth.',
    features: [
      'Everything in Discovery',
      'Automated Outreach Setup',
      'Customized Make.com Scenarios',
      'Quarterly Performance Review',
      'Priority Support',
    ],
    buttonText: 'Schedule Demo',
    highlighted: true,
  },
  {
    name: 'Enterprise Growth',
    price: 'Custom',
    description: 'Tailored solutions and dedicated support for large-scale operations.',
    features: [
      'Full Accelerator System',
      'Dedicated Technical Account Manager',
      'Custom AI Model Training',
      'On-site Consultation Available',
      'SLA Agreement',
    ],
    buttonText: 'Contact Sales',
    highlighted: false,
  },
]

export default function ProfessionalPricingGrid() {
  return (
    <section className="py-16 px-4 md:px-8 bg-black text-white">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight text-neutral-100 sm:text-5xl">
          Professional Engagement Models
        </h2>
        <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
          Choose the precise level of engagement required to transform your revenue recovery process.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 max-w-7xl mx-auto items-start">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-3xl p-8 ring-1 ring-neutral-800 ${
              tier.highlighted ? 'bg-neutral-900 shadow-2xl scale-105 ring-2 ring-blue-500' : 'bg-black'
            }`}
          >
            <h3
              className={`text-lg font-semibold leading-7 ${
                tier.highlighted ? 'text-blue-400' : 'text-neutral-300'
              }`}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span className="text-4xl font-bold tracking-tight text-white">{tier.price}</span>
            </p>
            <p className="mt-6 text-base leading-7 text-neutral-400">{tier.description}</p>
            <ul
              role="list"
              className={`mt-8 space-y-3 text-sm leading-6 text-neutral-300 ${
                tier.highlighted ? 'text-neutral-200' : 'text-neutral-400'
              }`}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <Check className={`h-6 w-5 flex-none ${tier.highlighted ? 'text-blue-500' : 'text-neutral-600'}`} aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                alert('Trigger booking modal/navigation for: ' + tier.name)
              }}
              className={`mt-10 block w-full rounded-xl px-3 py-3 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                tier.highlighted
                  ? 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600'
                  : 'bg-neutral-800 text-white hover:bg-neutral-700 focus-visible:outline-white'
              }`}
            >
              {tier.buttonText}
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
