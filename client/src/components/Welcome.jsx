import React, { useEffect } from "react";
import welcome from "../assets/smart.webp";
import { Link } from "react-router-dom";

function Welcome() {
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in-stagger");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el, i) => {
      el.style.transitionDelay = `${i * 200}ms`;
      observer.observe(el);
    });
  }, []);

  return (
    <section className="w-full min-h-screen flex flex-col bg-gradient-to-br bg-white">
      <header className="container mx-auto flex justify-between items-center py-4 px-6 fade-in-stagger opacity-0 translate-y-10">
        {/* Add logo or nav if needed */}
      </header>

      <div className="flex flex-col lg:flex-row items-center justify-center flex-1 px-6 lg:px-20 gap-10 mt-10">
        <div className="text-center lg:text-left max-w-lg fade-in-stagger opacity-0 translate-y-10">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Welcome to Smart Rent & Utility Systems
          </h1>
          <p className="text-gray-700 text-base lg:text-lg mb-6 leading-relaxed">
            Simplify your rent and utility payments with a modern, reliable, and
            easy-to-use platform.
          </p>
          <div className="flex justify-center lg:justify-start gap-4 fade-in-stagger opacity-0 translate-y-10">
            <Link
              to="/register"
              className="bg-green-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition duration-500 transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border border-green-500 text-green-700 font-medium px-5 py-3 rounded-full hover:bg-green-100 transition duration-500 transform hover:scale-105"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="flex justify-center items-center mt-4 max-w-lg fade-in-stagger opacity-0 translate-y-10">
          <img
            src={welcome}
            alt="Welcome"
            className="rounded-xl shadow-2xl w-full max-w-md transform p-6 transition duration-700 hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}

export default Welcome;