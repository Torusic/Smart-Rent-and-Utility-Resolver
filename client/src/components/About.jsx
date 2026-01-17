import React, { useState } from "react";


export default function About() {
  const [expanded, setExpanded] = useState(false);

  return (
    <main className="lg:w-full w-89 mx-auto shadow-md   p-6 bg-green-100 object-  rounded-md">
      <header className="mb-6">
        <h1 className="text-sm lg:text-2xl font-semibold text-gray-800">About Smart Rent & Utility Resolver</h1>
        <p className="mt-2 text-sm text-gray-600">
          Smart Rent & Utility Resolver is a platform built to simplify rental and utility management for tenants. It
          provides clear, secure and convenient tools for tracking payments and communicating with landlords.
        </p>
      </header>

      <section className="mb-6">
        <h2 className="text-lg font-medium text-gray-800">What we offer</h2>
        <div className="mt-3 px-3 space-y-2 text-gray-600 list-disc list-inside">
          <p>
            <strong>Transparent rent tracking:</strong> View balances, due dates and full payment history at any time.
          </p>
          <p>
            <strong>Utility monitoring:</strong> Access up-to-date information on electricity and water usage.
          </p>
          <p>
            <strong>Secure payments:</strong> Pay rent and utilities digitally using secure payment methods.
          </p>
          <p>
            <strong>Reminders and notifications:</strong> Receive timely alerts so you do not miss deadlines.
          </p>
          <p>
            <strong>Fair conflict resolution:</strong> Clear, auditable records to help resolve disputes professionally.
          </p>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-medium text-gray-800">Why it matters</h2>
        <p className="mt-3 text-gray-600">
          Tenants deserve a straightforward and reliable renting experience. By centralizing rent and utility
          information, the platform reduces confusion, improves transparency and promotes better communication
          between tenants and landlords.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-medium text-gray-800">Our mission</h2>
        <p className="mt-3 text-gray-600">
          Our mission is to empower tenants with clarity, convenience and control in rental and utility management,
          while fostering fair and professional relationships between tenants and landlords.
        </p>
      </section>

      <section className="mb-6">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-medium text-gray-800">Learn more</h2>
          <button
            onClick={() => setExpanded((s) => !s)}
            className="text-sm text-green-600 underline ml-4 focus:outline-none"
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 text-gray-600 space-y-3">
            <p>
              The platform is built with tenant convenience in mind. It keeps detailed records of transactions and
              usage, and supports secure digital payments. Tenants can export or print payment receipts, see
              historical usage, and receive timely notifications about upcoming payments or changes.
            </p>

            <p>
              In cases of disagreement, the system preserves time-stamped records that can be used to clarify
              situations and support fair resolution. Our approach emphasizes transparency, accountability and
              usability so that both tenants and landlords can manage properties with confidence.
            </p>

            <p>
              If you have questions or need support, please contact your property manager through the platform's
              support channel so we can assist you promptly.
            </p>
          </div>
        )}
      </section>

      <footer className="pt-4 border-t text-sm text-gray-500">
        <p>Version 1.0 — Smart Rent & Utility Resolver</p>
        <p className="mt-1">For help or feedback, contact your property manager or admin.</p>
      </footer>
    </main>
  );
}
