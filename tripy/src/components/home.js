import React from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-8 h-8 text-teal-500" />
            <span className="text-xl font-semibold text-gray-900">
              TravelAI
            </span>
          </div>
          <div className="flex space-x-4">
            <Link to="/login">
              <button className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                Sign Up
              </button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Your AI Travel Companion for Perfect Adventures
            </h1>
            <p className="text-xl text-gray-600">
              Plan your trips, discover hidden gems, and get personalized travel
              recommendations with our intelligent travel assistant.
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-teal-500" />
                <span className="text-gray-700">
                  Personalized travel recommendations
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-teal-500" />
                <span className="text-gray-700">
                  24/7 intelligent trip planning assistance
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-teal-500" />
                <span className="text-gray-700">
                  Local insights and hidden gems
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex space-x-4 pt-4">
              <button className="px-8 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                Get Started Free
              </button>
              <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative">
            <div className="bg-gray-100 rounded-2xl p-4">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-teal-500" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-600">
                      Hi! I'd like to plan a trip to Japan for two weeks.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-teal-50 rounded-lg p-3 text-sm text-gray-600">
                      I'll help you create the perfect 2-week Japan itinerary!
                      Would you like to focus on major cities, traditional
                      culture, or a mix of both?
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -z-10 top-10 right-10 w-40 h-40 bg-teal-50 rounded-full blur-3xl"></div>
            <div className="absolute -z-10 bottom-10 left-10 w-40 h-40 bg-gray-50 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
