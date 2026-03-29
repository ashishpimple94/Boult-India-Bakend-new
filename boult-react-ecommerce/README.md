# Boult India E-commerce Frontend

Complete React TypeScript e-commerce application for Boult India vehicle care products.

## 🚀 Features

### E-commerce Core
- **Product Catalog**: 22 premium vehicle care products with detailed specifications
- **Shopping Cart**: Add/remove items, quantity management, real-time total calculation
- **User Authentication**: Complete signup/login system with backend integration
- **Order Management**: Order history, tracking, and status updates

### Payment Integration
- **Razorpay Integration**: Multiple payment methods support
  - Credit/Debit Cards
  - UPI (GPay, PhonePe, Paytm)
  - Net Banking
  - Cash on Delivery (COD)
- **Payment Verification**: Secure payment processing and verification

### Professional Features
- **PDF Invoice Generation**: Professional invoices with company branding
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Smooth Animations**: Scroll animations and hover effects
- **SEO Optimized**: Meta tags and structured data
- **Professional UI**: Clean, modern interface with consistent branding

### Pages & Functionality
- **Home**: Hero section, featured products, company information
- **Products**: Complete product catalog with filtering and search
- **Product Details**: Detailed product information, specifications, images
- **Cart & Checkout**: Streamlined checkout process
- **User Account**: Profile management, order history
- **Legal Pages**: Terms, Privacy Policy, Return Policy, Shipping Policy
- **Contact & About**: Company information and contact details

## 🛠 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Payment**: Razorpay SDK
- **PDF Generation**: jsPDF
- **Icons**: Lucide React
- **Animations**: CSS transitions and transforms
- **Build Tool**: Create React App

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/ashishpimple94/Boultindia-Frontend.git
cd Boultindia-Frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=https://boult-india-bakend-new.onrender.com
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   ├── BannerSlider.tsx # Homepage banner slider
│   ├── Modal.tsx       # Modal dialogs
│   ├── Toast.tsx       # Notification toasts
│   ├── ConfirmDialog.tsx # Confirmation dialogs
│   └── Invoice.tsx     # PDF invoice component
├── pages/              # Page components
│   ├── Home.tsx        # Homepage
│   ├── Products.tsx    # Product catalog
│   ├── ProductDetail.tsx # Product details
│   ├── Cart.tsx        # Shopping cart
│   ├── Checkout.tsx    # Checkout process
│   ├── Login.tsx       # User login
│   ├── Signup.tsx      # User registration
│   ├── Account.tsx     # User account
│   ├── About.tsx       # About page
│   ├── Contact.tsx     # Contact page
│   └── [legal pages]   # Terms, Privacy, etc.
├── context/            # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   └── CartContext.tsx # Shopping cart state
├── services/           # API services
│   └── api.ts          # Backend API calls
├── data/               # Static data
│   └── products.ts     # Product catalog
├── hooks/              # Custom React hooks
│   └── useScrollAnimation.ts
└── App.tsx             # Main app component
```

## 🔧 Available Scripts

```bash
# Development
npm start              # Start development server
npm run build          # Build for production
npm test               # Run tests
npm run eject          # Eject from Create React App

# Deployment
npm run build          # Create production build
```

## 🌐 Backend Integration

This frontend connects to the Boult India backend API for:
- User authentication and management
- Product data synchronization
- Order processing and management
- Payment verification
- Admin panel integration

**Backend Repository**: [Boult India Backend](https://github.com/ashishpimple94/boult-backend)

## 💳 Payment Integration

### Razorpay Setup
1. Create a Razorpay account
2. Get your Key ID and Key Secret
3. Add Key ID to environment variables
4. Configure webhook for payment verification

### Supported Payment Methods
- **Cards**: Visa, Mastercard, Rupay, American Express
- **UPI**: All UPI apps (GPay, PhonePe, Paytm, etc.)
- **Net Banking**: 50+ banks supported
- **Wallets**: Paytm, Mobikwik, Freecharge
- **Cash on Delivery**: Available for all locations

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Enhanced experience on tablets
- **Desktop**: Full-featured desktop experience
- **Cross-browser**: Compatible with all modern browsers

## 🔒 Security Features

- **Secure Authentication**: JWT-based authentication
- **Payment Security**: PCI DSS compliant payment processing
- **Data Validation**: Client and server-side validation
- **HTTPS**: Secure data transmission
- **Environment Variables**: Sensitive data protection

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Netlify**: Automatic deployment from GitHub
- **Vercel**: Zero-config deployment
- **Hostinger**: Manual deployment with build files
- **AWS S3**: Static website hosting

### Environment Configuration
- Development: `.env.local`
- Production: `.env.production`

## 📊 Performance

- **Lighthouse Score**: 90+ performance score
- **Bundle Size**: Optimized with code splitting
- **Image Optimization**: Compressed images and lazy loading
- **Caching**: Browser caching for static assets

## 🎨 Design System

- **Colors**: Consistent brand colors throughout
- **Typography**: Professional font hierarchy
- **Spacing**: Consistent spacing system
- **Components**: Reusable UI components
- **Icons**: Lucide React icon library

## 🔄 State Management

- **Authentication**: React Context for user state
- **Shopping Cart**: Persistent cart with localStorage
- **Product Data**: Centralized product management
- **UI State**: Local component state for UI interactions

## 📈 Analytics & Tracking

- **Google Analytics**: User behavior tracking
- **Conversion Tracking**: E-commerce conversion tracking
- **Performance Monitoring**: Real-time performance metrics

## 🛡 Error Handling

- **API Errors**: Graceful error handling with user feedback
- **Network Issues**: Retry mechanisms and offline support
- **Validation Errors**: Real-time form validation
- **Payment Errors**: Detailed payment error messages

## 🔧 Development Guidelines

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Consistent naming conventions

### Component Structure
- Functional components with hooks
- Props interface definitions
- Error boundaries for error handling
- Lazy loading for performance

## 📞 Support & Contact

- **Website**: [boultindia.com](https://boultindia.com)
- **Email**: support@boultindia.com
- **Phone**: +91-XXXXXXXXXX

## 📄 License

Private - All rights reserved by Boult India

---

**Developed by**: V Tech Multi Solutions  
**Version**: 1.0.0  
**Last Updated**: February 2026