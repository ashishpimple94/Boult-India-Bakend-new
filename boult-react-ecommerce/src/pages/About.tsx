import { Zap, Users, Shield, Target, Award, Leaf } from 'lucide-react';

export default function About() {
  const coreValues = [
    {
      icon: Users,
      title: 'Customer Centricity',
      description: 'We put our customers first in everything we do.'
    },
    {
      icon: Zap,
      title: 'Techno-Driven Quality',
      description: 'We harness innovation and technology to deliver exceptional products'
    },
    {
      icon: Shield,
      title: 'Integrity',
      description: 'We operate with transparency, honesty, and ethics.'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for continuous improvement and operational excellence.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Products' },
    { number: '50K+', label: 'Happy Customers' },
    { number: '15+', label: 'Years Experience' },
    { number: '100%', label: 'Quality Assured' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="text-white py-20 relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/Aboutus.jpg')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-2xl">About Boult India</h1>
          <p className="text-xl text-white drop-shadow-xl">Premium Vehicle Care & Maintenance Solutions</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Who We Are</h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              V Tech Multi Solutions offers you an extensive range of Vehicle Care and Maintenance products under the brand name <span className="font-bold text-orange-600">BOULT INDIA</span>.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              BOULT offers exceptional quality and value to earn trust and loyalty from our customers, partners and community.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              The products are carefully formulated using advanced technology and premium ingredients to ensure outstanding results in the vehicle maintenance as well as take care of the accessories to have a hassle-free journey.
            </p>
          </div>

          {/* Right Image */}
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-12 flex items-center justify-center">
            <div className="text-center">
              <Award size={80} className="text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">Premium Quality</h3>
              <p className="text-gray-600 mt-2">Advanced Technology & Premium Ingredients</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 py-12 border-y border-gray-200">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-4 rounded-full">
                      <Icon size={32} className="text-orange-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{value.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose Boult?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'Advanced Technology',
              description: 'Our products are formulated using cutting-edge technology and scientific research to deliver superior performance.'
            },
            {
              title: 'Premium Ingredients',
              description: 'We use only the highest quality ingredients sourced from trusted suppliers worldwide.'
            },
            {
              title: 'Trusted Brand',
              description: 'With years of experience, Boult has earned the trust of thousands of satisfied customers.'
            },
            {
              title: 'Comprehensive Range',
              description: 'From cleaning to maintenance, we offer a complete range of vehicle care solutions.'
            },
            {
              title: 'Exceptional Value',
              description: 'Premium quality at competitive prices - we believe in delivering value for money.'
            },
            {
              title: 'Customer Support',
              description: 'Our dedicated support team is always ready to help you with any queries or concerns.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-8 border-2 border-orange-100 hover:border-orange-300 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">{idx + 1}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Available On Marketplaces */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">Available On</h2>
            <p className="text-lg font-body text-gray-600">Find our products on leading e-commerce platforms</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 items-center">
            <div className="flex items-center justify-center h-16 sm:h-20 lg:h-24 hover:animate-spin transition-all duration-300">
              <img 
                src="/logos/Indiamart-Logo.png" 
                alt="IndiaMART"
                className="max-h-10 sm:max-h-12 lg:max-h-16 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center h-16 sm:h-20 lg:h-24 hover:animate-spin transition-all duration-300">
              <img 
                src="/logos/Meesho.png" 
                alt="Meesho"
                className="max-h-10 sm:max-h-12 lg:max-h-16 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center h-16 sm:h-20 lg:h-24 hover:animate-spin transition-all duration-300">
              <img 
                src="/logos/Shopify.png" 
                alt="Shopify"
                className="max-h-10 sm:max-h-12 lg:max-h-16 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center h-16 sm:h-20 lg:h-24 hover:animate-spin transition-all duration-300">
              <img 
                src="/logos/flipkart.-logo.png" 
                alt="Flipkart"
                className="max-h-10 sm:max-h-12 lg:max-h-16 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center h-16 sm:h-20 lg:h-24 hover:animate-spin transition-all duration-300 col-span-2 sm:col-span-1">
              <img 
                src="/logos/Amazon.png" 
                alt="Amazon"
                className="max-h-10 sm:max-h-12 lg:max-h-16 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <Target size={32} />
                Our Mission
              </h3>
              <p className="text-lg text-orange-100 leading-relaxed">
                To provide exceptional vehicle care and maintenance products that enhance the longevity and performance of vehicles while maintaining the highest standards of quality and customer satisfaction.
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <Leaf size={32} />
                Our Vision
              </h3>
              <p className="text-lg text-orange-100 leading-relaxed">
                To be the most trusted and preferred brand for vehicle care solutions in India, recognized for innovation, quality, and customer-centric approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">OUR LATEST BLOGS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              image: 'https://simbott.com/wp-content/uploads/2024/05/Automotive-Spray-Painting--1024x576.webp',
              title: 'Give Your Ride A New Life With Boult Spray Paint',
              subtitle: 'Restore, Refresh, Reimagine – The Power of Boult Spray Paint for Cars & Bikes'
            },
            {
              image: 'https://img.freepik.com/premium-photo/man-greasing-motorcycle-chain-close-up-hand_79405-13572.jpg',
              title: 'The Ultimate Duo For A Healthier Ride – Boult Chain Lubricant & Anti Rust Spray',
              subtitle: 'Smooth Chains, Rust-Free rides. The Essential Duo For Vehicle Maintenance.'
            },
            {
              image: 'https://img.freepik.com/premium-photo/engine-oil-splashing-isolated-white-background_1028938-293110.jpg',
              title: 'Keep Your Engine Younger, Longer With Boult Engine Oil Treatment',
              subtitle: 'More Miles, Less Trouble – The Engine Oil Upgrade Your Vehicle Needs'
            }
          ].map((blog, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {blog.subtitle}
                </p>
                <a href="#" className="text-orange-600 font-semibold hover:text-orange-700 transition flex items-center gap-2">
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
