import Link from "next/link";

const tenants = [
  {
    id: 1,
    name: "Premium Cars",
    domain: "premium",
    description: "Luxury car rentals for special occasions",
    logo: "/tenant-logos/premium.png",
  },
  {
    id: 2,
    name: "City Rentals",
    domain: "city",
    description: "Affordable city cars for daily use",
    logo: "/tenant-logos/city.png",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Decorative background elements */}
      <div
        className="hero-gradient"
        aria-hidden="true"
        style={{
          clipPath:
            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.0%)",
        }}
      />

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-24 sm:py-32 lg:py-40">
          <div className="text-center animate-fadeInUp">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent sm:text-6xl lg:text-7xl">
              Welcome to Car Rental Portal
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Choose your preferred rental service provider and start your
              journey today. We offer a wide range of vehicles to suit your
              needs.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:gap-8 max-w-3xl mx-auto animate-fadeInUp [animation-delay:200ms]">
            {tenants.map((tenant) => (
              <Link
                key={tenant.id}
                href={`http://${tenant.domain}.localhost:3000/auth/login`}
                className="tenant-card group"
              >
                <div className="tenant-logo">{tenant.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="focus:outline-none">
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">
                      {tenant.name}
                    </h2>
                    <p className="mt-1 text-base text-gray-500 group-hover:text-gray-600">
                      {tenant.description}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <svg
                    className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
