import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <p className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                074-0528469
              </p>
              <p className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Maintanance Officer
              </p>
              <p className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Pahalagalathura Community Based Organization,
                Pahalagalathura.
              </p>
            </div>
          </div>
          
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} HydroNet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;