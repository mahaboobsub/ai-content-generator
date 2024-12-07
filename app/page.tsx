"use client";

import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      
      <header className="flex justify-between items-center p-5 bg-white shadow-sm">
        <div className="flex items-center">
          <Image src={'/logo.svg'} alt='logo' width={120} height={100}/>
        </div>
        <nav className="flex gap-5">
        
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" >
            To access DashBoard click below button
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center bg-gray-50 py-20">
        <div className="container mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-800">
            AI Content <span className="text-blue-600">Generator</span>
          </h1>

          {/* Text Section */}
          <div className="text-lg text-gray-600 dark:text-neutral-400 mt-4">
            <p>
              Revolutionize your content creation with our AI-powered app,
              deliver
            </p>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="mt-8 gap-3 flex justify-center">
            <a
              className="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium"
              href="/dashboard"
            >
              Get started
              <svg
                className="flex-shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {/* Feature 1 */}
          <div className="p-5 border rounded-lg">
           
            <h3 className="mt-4 text-lg font-bold">25+ Templates</h3>
            <p className="text-gray-500">
              Responsive, and mobile-first projects on the web.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="p-5 border rounded-lg">
            
            <h3 className="mt-4 text-lg font-bold">Customizable</h3>
            <p className="text-gray-500">
              Components are easily customized and extendable.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="p-5 border rounded-lg">
            
            <h3 className="mt-4 text-lg font-bold">Free to Use</h3>
            <p className="text-gray-500">
              Every component and plugin is well documented.
            </p>
          </div>
          {/* Feature 4 */}
          <div className="p-5 border rounded-lg">
           
            <h3 className="mt-4 text-lg font-bold">24/7 Support</h3>
            <p className="text-gray-500">
              Contact us 24 hours a day, 7 days a week.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}