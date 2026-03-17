import React from "react";
import { Link } from "react-router";
import heroImg from "../assets/hero.png";

function Home() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Decorative background blob */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50 z-0"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              New Courses Available
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight mb-8">
              Master New Skills with <span className="text-blue-600 relative">
                SunStk
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                  <path d="M0 7L20 3C40 -1 60 7 100 3" stroke="#2563eb" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-12">
              Unlock your potential with our expert-led courses. Join thousands of students learning everything from development to design in a modern, interactive environment.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Link
                to="/register"
                className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 text-lg"
              >
                Get Started for Free
              </Link>
              <Link
                to="/login"
                className="px-10 py-5 bg-white text-gray-900 font-black rounded-2xl hover:bg-gray-50 transition-all active:scale-95 border border-gray-200 text-lg shadow-sm"
              >
                Sign In
              </Link>
            </div>
            
            <div className="mt-16 flex items-center gap-8 justify-center lg:justify-start opacity-40 grayscale">
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Trusted by:</span>
               <div className="flex gap-6 font-black text-xl text-gray-500 italic">
                  <span>Google</span>
                  <span>Meta</span>
                  <span>Netflix</span>
               </div>
            </div>
          </div>
          
          <div className="mt-20 lg:mt-0 lg:col-span-6 relative">
            <div className="relative group">
              <div className="absolute -inset-6 bg-blue-100 rounded-[3.5rem] -rotate-3 blur-2xl opacity-40 group-hover:rotate-0 transition-transform duration-700"></div>
              <img
                src={heroImg}
                alt="Hero"
                className="relative w-full rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] object-cover aspect-[4/3] transform group-hover:scale-[1.02] transition-transform duration-700"
              />
              
              {/* Floating Card */}
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-50 max-w-[240px] hidden md:block animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-black text-gray-900 leading-none">500+ Courses</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Explore any topic</p>
                  </div>
                </div>
              </div>
              
              {/* Stats Badge */}
              <div className="absolute -top-6 -right-6 bg-blue-600 text-white p-6 rounded-full shadow-2xl w-24 h-24 flex items-center justify-center flex-col leading-tight border-4 border-white rotate-12">
                <span className="text-xl font-black italic">4.9</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter opacity-80">Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative circles */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-30 -mb-32 -ml-32"></div>
    </div>
  );
}

export default Home;
