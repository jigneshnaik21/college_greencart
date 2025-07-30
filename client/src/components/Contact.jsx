import React from "react";

const Contact = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Us</h2>

      <div className="space-y-4">
        <div className="flex items-start">
          <div className="min-w-[120px] font-medium text-gray-700">Name:</div>
          <div className="text-gray-600">Jignesh Naik</div>
        </div>

        <div className="flex items-start">
          <div className="min-w-[120px] font-medium text-gray-700">Mobile:</div>
          <div className="text-gray-600">
            <a
              href="tel:+919209109611"
              className="hover:text-primary transition-colors"
            >
              +91 9209109611
            </a>
          </div>
        </div>

        <div className="flex items-start">
          <div className="min-w-[120px] font-medium text-gray-700">Email:</div>
          <div className="text-gray-600">
            <a
              href="mailto:contact@greencart.com"
              className="hover:text-primary transition-colors"
            >
              contact@greencart.com
            </a>
          </div>
        </div>

        <div className="flex items-start">
          <div className="min-w-[120px] font-medium text-gray-700">
            Follow Us:
          </div>
          <div className="space-x-4">
            <a
              href="http://instagram.com/jignesh_naik21/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://x.com/JigneshNai19453"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://www.facebook.com/jignesh.naik.357"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
