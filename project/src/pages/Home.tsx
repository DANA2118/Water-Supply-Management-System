import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Shield, Clock, Leaf, AlertTriangle, Phone } from 'lucide-react';

function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div 
        className="h-[500px] bg-cover bg-top relative"
        style={{
          backgroundImage: 'url("/image.jpg")'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">Welcome to HydroNet</h1>
            <p className="text-xl mb-8">Pahalagalathura Community-based Organization</p>
            <Link
              to="/payment"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Pay Your Bill
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Droplets className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Water</h3>
              <p className="text-gray-600">Pure and safe drinking water that meets all quality standards</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Supply</h3>
              <p className="text-gray-600">Reliable water supply with backup systems</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Clock className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Service</h3>
              <p className="text-gray-600">Round-the-clock customer support and maintenance</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Leaf className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">Sustainable practices and environmental responsibility</p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="py-12 bg-red-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-4 text-red-600">
            <AlertTriangle className="h-8 w-8" />
            <h2 className="text-2xl font-bold">Emergency?</h2>
            <div className="flex items-center">
              <Phone className="h-6 w-6 mr-2" />
              <span className="text-2xl font-bold">074 0528469-EMERGENCY</span>
            </div>
            <h2 className="text-xl font-bold">or</h2>
            <Link 
            to="/complaint"
            className="ml-2 text-2xl font-bold text-red-600 hover:underline" >
            Submit complaint
          </Link>
          </div>
        </div>
      </div>

      {/* Usage Tips Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Water Conservation Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <img
              src="https://www.sovereignmagazine.com/wp-content/uploads/2023/09/jqwzkchlhoc.jpg"
              alt="Water Conservation"
              className="rounded-lg shadow-lg"
            />
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Fix Leaky Faucets</h3>
                <p>A dripping faucet can waste up to 20 gallons of water per day.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Water Plants Early</h3>
                <p>Water your garden early in the morning to reduce evaporation.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Use Water-Efficient Appliances</h3>
                <p>Modern appliances can help reduce your water consumption significantly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;