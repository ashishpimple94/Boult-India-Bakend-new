# Boult India Backend

Professional Node.js backend server for Boult India e-commerce platform with complete Razorpay payment integration.

## 🚀 Features

### Payment Integration
- **Razorpay Integration**: Complete payment gateway with order creation, verification, and payment details
- **Multiple Payment Methods**: Support for COD, Credit/Debit Cards, UPI, and Net Banking
- **Secure Payment Verification**: SHA256 signature validation for payment security
- **Payment Method Tracking**: Track payment methods for each order in admin panel

### Order Management
- **Complete CRUD Operations**: Create, Read, Update, Delete orders
- **Order Status Management**: pending, processing, shipped, delivered
- **Real-time Order Updates**: 5-second refresh for admin dashboard
- **Order Search & Filter**: Advanced filtering by status, customer, email
- **Payment Method Display**: Visual indicators for different payment methods

### API Endpoints
- **Products API**: Get all products with categories and variants
- **Orders API**: Complete order management system
- **Razorpay API**: Payment processing and verification
- **Health Check**: Backend monitoring and status

### Security & Performance
- **CORS Enabled**: Cross-origin resource sharing configured
- **Error Handling**: Comprehensive error handling and validation
- **JSON Validation**: Request body validation and sanitization
- **Environment Variables**: Secure configuration management

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Razorpay account (for payment integration)

### Setup
1. Clone the repository:
```bash
git clone https://github.com/ashishpimple94/Boult-India-Bakend-new.git
cd Boult-India-Bakend-new
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:5000`

## 🔧 API Documentation

### Products
- `GET /api/products` - Get all products

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:orderId` - Get specific order
- `POST /api/save-order` - Create new order
- `PUT /api/update-order` - Update order status
- `DELETE /api/delete-order` - Delete order

### Razorpay Payment
- `POST /api/razorpay/create-order` - Create Razorpay order
- `POST /api/razorpay/verify-payment` - Verify payment signature
- `GET /api/razorpay/payment/:paymentId` - Get payment details

### Health Check
- `GET /health` - Backend health status

## 💳 Payment Methods Supported

| Method | Code | Description |
|--------|------|-------------|
| 💵 COD | `cod` | Cash on Delivery |
| 💳 Card | `card` | Credit/Debit Cards |
| 📱 UPI | `upi` | UPI Payment |
| 🏦 Net Banking | `netbanking` | Net Banking |

## 📊 Order Status Flow

```
pending → processing → shipped → delivered
```

## 🗂️ Data Structure

### Order Object
```json
{
  "id": "ORD-1234567890",
  "customer": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "address": "123 Main St, City, State - 123456",
  "amount": 2999,
  "paymentMethod": "card",
  "status": "pending",
  "items": [...],
  "date": "2026-01-30T10:30:00.000Z",
  "paymentId": "pay_razorpay_id" // for online payments
}
```

## 🚀 Deployment

### Render.com (Recommended)
The repository includes `render.yaml` for easy deployment:

1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy automatically

### Manual Deployment
1. Set production environment variables
2. Run `npm start`
3. Configure reverse proxy (nginx recommended)

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID | Yes |
| `RAZORPAY_KEY_SECRET` | Razorpay API Secret | Yes |

## 📁 Project Structure

```
boult-backend/
├── data/
│   ├── orders.json      # Orders database
│   └── products.json    # Products database
├── .env                 # Environment variables
├── server.js           # Main server file
├── package.json        # Dependencies
├── render.yaml         # Render deployment config
└── README.md          # This file
```

## 🛠️ Development

### Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and test
3. Commit: `git commit -m "Add new feature"`
4. Push: `git push origin feature/new-feature`
5. Create Pull Request

### Testing
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test products endpoint
curl http://localhost:5000/api/products

# Test orders endpoint
curl http://localhost:5000/api/orders
```

## 📞 Support

For support and queries:
- **Email**: vtechmultisolutions@gmail.com
- **Phone**: +91 96651 54496
- **Business Hours**: Mon-Fri, 9AM-6PM IST

## 📄 License

This project is proprietary software owned by V Tech Multi Solutions.

---

**Built with ❤️ for Boult India by V Tech Multi Solutions**