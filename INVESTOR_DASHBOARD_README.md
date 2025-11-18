# Good Energy Investor Dashboard 📊☀️

## Overview

The **Good Energy Investor Dashboard** is a secure, data-driven user portal where investors can track their solar investments, view earnings, monitor performance, and access comprehensive financial insights. Built with transparency, trust, and user empowerment at its core, this dashboard reinforces Good Energy's brand pillars of sustainability and reliability.

## 🎯 Mission Statement

To provide investors with a world-class digital experience that offers complete transparency into their solar investments while making complex financial data accessible and actionable through elegant, intuitive design.

## ⚡ Key Features

### 📈 Real-time Investment Tracking
- **Portfolio Overview**: Complete view of all active investments
- **Performance Metrics**: ROI tracking, growth projections, and actual returns
- **Live Data Updates**: Real-time synchronization with solar plant performance
- **Investment Health Scoring**: AI-powered insights into investment performance

### 💰 Earnings & Payouts Management  
- **Earnings Dashboard**: Interactive charts showing monthly, quarterly, and annual returns
- **Transaction History**: Complete payout history with filtering and export capabilities
- **Tax Management**: Automatic tax withholding calculations and reporting
- **Payment Tracking**: Real-time status of pending and processed payments

### 🌞 Solar Plant Performance
- **Plant Metrics**: Energy generation, capacity utilization, and efficiency tracking
- **Geographic Distribution**: Interactive maps showing plant locations and performance
- **Environmental Impact**: CO₂ reduction calculations and sustainability metrics
- **Maintenance Insights**: Plant status, maintenance schedules, and performance optimization

### 📊 Advanced Analytics
- **Performance Comparisons**: Benchmark your investments against market standards
- **Predictive Analytics**: AI-driven projections for future earnings
- **Risk Assessment**: Portfolio diversification analysis and risk metrics
- **Market Insights**: Solar industry trends and investment opportunities

## 🏗 Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: TailwindCSS v3 with custom Good Energy design tokens  
- **Animations**: Framer Motion for smooth, delightful interactions
- **Charts**: Recharts for interactive data visualizations
- **Icons**: Lucide React for consistent iconography
- **State Management**: React hooks with SWR for data fetching

### Backend Stack
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based secure authentication with middleware
- **API Routes**: Next.js API routes with proper error handling
- **Email System**: Resend API for notifications and reports
- **PDF Generation**: Server-side PDF generation for reports and statements
- **Security**: Input validation, SQL injection prevention, XSS protection

### Design System
- **Colors**: Solar-inspired palette with lime green accents (#D8DA00)
- **Typography**: Clean, modern fonts with proper hierarchy
- **Layout**: Responsive grid system with mobile-first approach
- **Components**: Modular, reusable component library
- **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation

## 📁 Project Structure

```
app/
├── (dashboard)/
│   ├── layout.tsx                     # Dashboard layout with sidebar navigation
│   └── inversiones/
│       ├── page.tsx                   # Main dashboard overview
│       ├── earnings/
│       │   └── page.tsx               # Earnings and charts page
│       ├── portfolio/
│       │   └── page.tsx               # Investment breakdown (planned)
│       ├── plants/
│       │   └── page.tsx               # Solar plants overview (planned)
│       ├── history/
│       │   └── page.tsx               # Transaction history (planned)
│       ├── profile/
│       │   └── page.tsx               # User profile management (planned)
│       └── components/
│           ├── OverviewCards.tsx      # KPI cards for dashboard metrics
│           ├── EarningsChart.tsx      # Interactive earnings visualization
│           ├── InvestmentBreakdown.tsx # Portfolio analysis (planned)
│           ├── ProjectList.tsx        # Solar plant listings (planned)
│           ├── TransactionHistory.tsx # Payment history (planned)
│           └── UserProfile.tsx        # Profile management (planned)

api/
├── dashboard/
│   ├── investments/
│   │   └── route.ts                   # Investment data API
│   ├── earnings/
│   │   └── route.ts                   # Earnings and chart data API
│   ├── profile/
│   │   └── route.ts                   # User profile API (planned)
│   └── reports/
│       └── pdf/
│           └── route.ts               # PDF report generation (planned)

lib/
├── dashboard/
│   └── utils.ts                       # Utility functions and calculations
└── prisma.ts                          # Database client configuration

prisma/
└── schema.prisma                      # Database schema with investment models
```

## 🗄 Database Schema

### Core Models

#### User Model
```typescript
model User {
  id          String   @id @default(cuid())
  name        String
  email       String   @unique
  phone       String?
  country     String?
  avatar      String?
  isActive    Boolean  @default(true)
  investments Investment[]
  earnings    Earning[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### Investment Model
```typescript
model Investment {
  id          String   @id @default(cuid())
  userId      String
  plantId     String?
  type        String   // "Base", "Crecimiento", "Premium"
  amount      Float    // Investment amount in COP
  currency    String   @default("COP")
  roi         Float    // Expected annual ROI percentage
  actualRoi   Float?   // Actual ROI achieved
  status      String   @default("Activa")
  startDate   DateTime @default(now())
  maturityDate DateTime?
  earnings    Earning[]
  user        User     @relation(fields: [userId], references: [id])
  plant       SolarPlant? @relation(fields: [plantId], references: [id])
}
```

#### Earning Model
```typescript
model Earning {
  id            String   @id @default(cuid())
  userId        String
  investmentId  String
  amount        Float    // Earning amount in COP
  currency      String   @default("COP")
  type          String   // "Ganancia", "Reinversión", "Interés"
  status        String   @default("Pendiente")
  paymentDate   DateTime?
  paymentMethod String?
  taxWithheld   Float    @default(0)
  netAmount     Float    // Amount after taxes
  user          User     @relation(fields: [userId], references: [id])
  investment    Investment @relation(fields: [investmentId], references: [id])
}
```

#### SolarPlant Model
```typescript
model SolarPlant {
  id              String   @id @default(cuid())
  name            String
  location        String
  coordinates     String?  // "lat,lng" format
  capacity        Float    // kW capacity
  energyGenerated Float    @default(0) // Total kWh generated
  status          String   @default("En construcción")
  startDate       DateTime?
  completionDate  DateTime?
  investments     Investment[]
}
```

## 🎨 User Experience Design

### Design Philosophy
The dashboard embodies Good Energy's commitment to transparency and sustainability through:

- **Solar-Inspired Aesthetics**: Clean, bright design with solar yellow accents
- **Data Transparency**: Clear, honest presentation of all financial information
- **Intuitive Navigation**: Logical information architecture with easy access to key features
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Accessibility First**: Full keyboard navigation and screen reader support

### User Journey Flow

#### 1. Authentication & Welcome (0-10 seconds)
- **Secure Login**: JWT-based authentication with session management
- **Personalized Welcome**: Dynamic greeting with key portfolio metrics
- **Quick Status Check**: Immediate visibility of investment health and pending actions

#### 2. Portfolio Overview (10-60 seconds)
- **KPI Dashboard**: Six key metrics cards showing investment performance
- **Visual Hierarchy**: Most important information prominently displayed
- **Action Items**: Clear next steps and actionable insights

#### 3. Detailed Analysis (1-5 minutes)
- **Interactive Charts**: Multiple visualization options (area, line, bar charts)
- **Drill-down Capability**: Click to explore detailed transaction history
- **Comparative Analysis**: Benchmarking against expected returns

#### 4. Action & Export (5+ minutes)
- **Report Generation**: PDF exports for tax filing and record keeping
- **Investment Decisions**: Links to new investment opportunities
- **Profile Management**: Update preferences and notification settings

## 🔧 Component Architecture

### OverviewCards Component
```typescript
interface OverviewMetrics {
  totalInvested: number;        // Total investment amount
  totalEarnings: number;        // Cumulative earnings
  pendingEarnings: number;      // Upcoming payments
  overallROI: number;          // Portfolio-wide ROI percentage
  totalEnergyGenerated: number; // kWh from all plants
  co2Saved: number;            // Environmental impact in tons
}

// Features:
// - Animated loading states
// - Responsive grid layout
// - Hover effects and micro-interactions
// - Dynamic color coding based on performance
```

### EarningsChart Component
```typescript
type ChartType = 'line' | 'area' | 'bar';
type TimePeriod = 'mensual' | 'trimestral' | 'anual';

// Features:
// - Multiple visualization types
// - Interactive tooltips with detailed breakdowns
// - Time period filtering
// - Performance statistics summary
// - Responsive design with mobile optimization
```

### Dashboard Layout
```typescript
// Features:
// - Responsive sidebar navigation
// - Mobile-first hamburger menu
// - User profile dropdown
// - Breadcrumb navigation
// - Quick action buttons
// - Real-time notification center
```

## 📊 Data Visualization Strategy

### Chart Types & Use Cases

#### Area Charts (Default)
- **Best for**: Showing investment growth over time
- **Visual Impact**: Emphasizes cumulative value growth
- **User Benefit**: Clear understanding of portfolio expansion

#### Line Charts
- **Best for**: Comparing multiple investment types
- **Visual Impact**: Clean comparison between Base, Crecimiento, Premium
- **User Benefit**: Easy identification of best-performing investments

#### Bar Charts  
- **Best for**: Monthly earning comparisons
- **Visual Impact**: Clear discrete period comparisons
- **User Benefit**: Quick identification of seasonal patterns

### Color Psychology
- **Green Gradients**: Growth, money, success, environmental benefits
- **Solar Yellow**: Energy, optimism, innovation, sun power
- **Blue Accents**: Trust, stability, reliability, technology
- **Neutral Grays**: Professional, clean, focus on data

## 🔐 Security & Authentication

### Authentication Flow
1. **JWT Token Generation**: Secure token creation with expiration
2. **Middleware Protection**: Route-level authentication checks
3. **Session Management**: Automatic token refresh and logout
4. **Multi-device Support**: Simultaneous sessions with security monitoring

### Data Protection
- **Input Validation**: Server-side validation of all user inputs
- **SQL Injection Prevention**: Parameterized queries through Prisma
- **XSS Protection**: React's built-in escaping + additional sanitization
- **CSRF Protection**: Token-based cross-site request forgery prevention

### Privacy & Compliance
- **Data Minimization**: Only collect necessary user information
- **Encryption**: All sensitive data encrypted at rest and in transit
- **Audit Logging**: Comprehensive logs for security monitoring
- **GDPR Compliance**: Right to data export and deletion

## 📱 Mobile Experience

### Responsive Breakpoints
```css
/* Mobile First Approach */
- Mobile: 320px - 768px (Primary focus)
- Tablet: 769px - 1024px (Optimized layout)
- Desktop: 1025px+ (Full feature set)
```

### Mobile-Specific Features
- **Touch Optimized**: Large touch targets and swipe gestures
- **Condensed Navigation**: Collapsible sidebar with essential links
- **Simplified Charts**: Mobile-optimized chart interactions
- **Offline Capability**: Basic data caching for poor connectivity
- **Progressive Web App**: Installable app experience

## 🚀 Performance Optimization

### Frontend Performance
- **Code Splitting**: Route-based and component-based splitting
- **Image Optimization**: Next.js Image component with lazy loading
- **Font Optimization**: Local fonts with proper display swap
- **Bundle Analysis**: Regular monitoring of JavaScript bundle size

### Backend Performance  
- **Database Indexing**: Optimized queries with proper indexes
- **Caching Strategy**: Redis caching for frequently accessed data
- **API Rate Limiting**: Protection against abuse and overuse
- **Connection Pooling**: Efficient database connection management

### Real-time Features
- **WebSocket Integration**: Live updates for earnings and plant data
- **Optimistic Updates**: Immediate UI feedback with background sync
- **SWR Caching**: Intelligent data fetching with cache invalidation
- **Background Sync**: Service worker for offline data synchronization

## 📈 Analytics & Metrics

### Key Performance Indicators (KPIs)
- **User Engagement**: Time spent, pages visited, return frequency
- **Feature Usage**: Most/least used dashboard features
- **Performance Metrics**: Page load times, error rates, conversion funnels
- **Business Metrics**: Investment growth, user satisfaction, retention rates

### User Analytics
```javascript
// Example tracking events
gtag('event', 'dashboard_view', {
  event_category: 'engagement',
  event_label: 'homepage',
  user_id: session.user.id
});

gtag('event', 'export_report', {
  event_category: 'conversion',
  event_label: 'pdf_download',
  value: 1
});

gtag('event', 'investment_performance_check', {
  event_category: 'engagement',
  event_label: 'earnings_chart_view',
  custom_parameter_1: chartType,
  custom_parameter_2: timePeriod
});
```

## 🔮 Future Enhancements

### Phase 2 Features (Next 3 months)
- **Portfolio Page**: Detailed investment breakdown with performance analytics
- **Solar Plants Page**: Interactive maps and detailed plant performance metrics
- **Transaction History**: Advanced filtering, search, and bulk export capabilities
- **User Profile**: Editable profile with notification preferences and security settings

### Phase 3 Features (6 months)
- **PDF Report Generation**: Automated monthly/quarterly investment reports
- **Mobile App**: Native iOS and Android applications
- **Advanced Analytics**: AI-powered investment recommendations
- **Social Features**: Community forums and investor networking

### Phase 4 Features (12 months)
- **API Integration**: Third-party financial software integration
- **Tax Integration**: Direct integration with tax preparation software
- **Investment Automation**: Automatic reinvestment and rebalancing
- **ESG Reporting**: Comprehensive environmental impact reporting

## 🛠 Development Setup

### Prerequisites
```bash
- Node.js 18+
- npm or yarn
- PostgreSQL database
- Prisma CLI
```

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/good_energy"

# Authentication
JWT_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email Service
RESEND_API_KEY="re_your_api_key"

# Analytics (Optional)
GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
```

### Installation & Setup
```bash
# Clone repository
git clone <repository-url>
cd good-energy-website

# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push

# Seed development data (optional)
npx prisma db seed

# Start development server
npm run dev
```

### Build & Deploy
```bash
# Production build
npm run build

# Start production server
npm start

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 🧪 Testing Strategy

### Unit Testing
- **Component Testing**: React Testing Library for UI components
- **Utility Testing**: Jest for business logic and calculations
- **API Testing**: Supertest for API route validation

### Integration Testing
- **Database Testing**: Test database operations and transactions
- **Authentication Testing**: Verify security flows and JWT handling
- **End-to-end Testing**: Cypress for complete user journey testing

### Performance Testing
- **Load Testing**: Artillery for API performance under load
- **Bundle Analysis**: webpack-bundle-analyzer for optimization
- **Lighthouse Audits**: Regular performance and accessibility audits

## 📞 Support & Maintenance

### Monitoring & Alerting
- **Error Tracking**: Sentry for real-time error monitoring
- **Performance Monitoring**: New Relic or similar APM solution
- **Uptime Monitoring**: Ping monitoring with instant alerts
- **Database Monitoring**: Query performance and connection health

### Backup & Recovery
- **Database Backups**: Automated daily backups with point-in-time recovery
- **File Backups**: Regular backup of uploaded documents and reports
- **Disaster Recovery**: Documented procedures for system restoration
- **Data Retention**: Compliant data retention and purging policies

### Maintenance Schedule
- **Weekly**: Dependency updates, security patches
- **Monthly**: Performance analysis, user feedback review
- **Quarterly**: Major feature releases, comprehensive testing
- **Annually**: Architecture review, technology stack evaluation

---

## 🏆 Success Metrics

### User Experience Goals
- **Page Load Time**: < 2 seconds for all dashboard pages
- **User Satisfaction**: > 4.5/5 stars in user feedback
- **Accessibility Score**: > 95% WCAG 2.1 AA compliance
- **Mobile Experience**: > 90% feature parity with desktop

### Business Impact Goals  
- **User Engagement**: > 80% monthly active user rate
- **Feature Adoption**: > 60% users interact with charts monthly
- **Support Reduction**: < 5% support tickets related to dashboard confusion
- **Investment Growth**: Track correlation between dashboard usage and reinvestment rates

## 🤝 Contributing

We welcome contributions from the development team! Please follow these guidelines:

1. **Code Style**: Follow existing TypeScript and React patterns
2. **Testing**: Include unit tests for new features
3. **Documentation**: Update documentation for any new functionality
4. **Security**: Never commit sensitive data or API keys
5. **Performance**: Consider performance impact of all changes

---

**Built with ❤️ for Good Energy Investors**  
*Empowering sustainable investment decisions through transparent, beautiful data visualization*

Transform your solar investments into clear, actionable insights with the Good Energy Investor Dashboard - where sustainability meets profitability! ☀️📈