import React, { useState } from "react";

export default function About() {
  const [expanded, setExpanded] = useState(false);

  return (
    <main className="max-w-8xl mx-auto mt-8 p-8 bg-white rounded-2xl shadow-md ">

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          About Smart Rent & Utility Resolver
        </h1>
        <p className="mt-3 text-gray-600 leading-relaxed">
          Smart Rent & Utility Resolver is a platform built to simplify rental
          and utility management for tenants. It provides clear, secure and
          convenient tools for tracking payments and communicating with
          landlords.
        </p>
      </header>

      {/* What We Offer */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 border-l-4 border-green-500 pl-3">
          What we offer
        </h2>

        <div className="mt-4 space-y-3 text-gray-600 text-sm leading-relaxed">
          <p>
            <strong>Transparent rent tracking:</strong> View balances, due
            dates and full payment history at any time.
          </p>

          <p>
            <strong>Utility monitoring:</strong> Access up-to-date information
            on electricity and water usage.
          </p>

          <p>
            <strong>Secure payments:</strong> Pay rent and utilities digitally
            using secure payment methods.
          </p>

          <p>
            <strong>Reminders and notifications:</strong> Receive timely alerts
            so you do not miss deadlines.
          </p>

          <p>
            <strong>Fair conflict resolution:</strong> Clear, auditable records
            to help resolve disputes professionally.
          </p>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-500 pl-3">
          Why it matters
        </h2>

        <p className="mt-4 text-gray-600 text-sm leading-relaxed">
          Tenants deserve a straightforward and reliable renting experience. By
          centralizing rent and utility information, the platform reduces
          confusion, improves transparency and promotes better communication
          between tenants and landlords.
        </p>
      </section>

      {/* Mission */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 border-l-4 border-yellow-500 pl-3">
          Our mission
        </h2>

        <p className="mt-4 text-gray-600 text-sm leading-relaxed">
          Our mission is to empower tenants with clarity, convenience and
          control in rental and utility management, while fostering fair and
          professional relationships between tenants and landlords.
        </p>
      </section>

      {/* Learn More */}
      <section className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Learn more
          </h2>

          <button
            onClick={() => setExpanded((s) => !s)}
            className="text-sm font-medium text-green-600 hover:text-green-700 transition"
            aria-expanded={expanded}
          >
            {expanded ? "Show less ↑" : "Read more ↓"}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 text-gray-600 text-sm leading-relaxed space-y-4 animate-fadeIn">
            <p>
              The platform is built with tenant convenience in mind. It keeps
              detailed records of transactions and usage, and supports secure
              digital payments. Tenants can export or print payment receipts,
              see historical usage, and receive timely notifications about
              upcoming payments or changes.
            </p>

            <p>
              In cases of disagreement, the system preserves time-stamped
              records that can be used to clarify situations and support fair
              resolution. Our approach emphasizes transparency, accountability
              and usability so that both tenants and landlords can manage
              properties with confidence.
            </p>

            <p>
              If you have questions or need support, please contact your
              property manager through the platform's support channel so we can
              assist you promptly.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="pt-6 border-t text-xs text-gray-500 flex flex-col sm:flex-row justify-between">
        <p>Version 1.0 — Smart Rent & Utility Resolver</p>
        <p className="mt-2 sm:mt-0">
          For help or feedback, contact your property manager or admin.
        </p>
      </footer>

    </main>
  );
}