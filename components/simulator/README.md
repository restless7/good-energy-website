# Investment Simulator - Good Energy

## Overview

The Investment Simulator is a comprehensive feature that allows potential investors to calculate projected returns on solar energy investments. It provides an interactive interface with real-time calculations, dynamic visualizations, and conversion-optimized user experience.

## Features

### 🧮 ROI Calculation Engine
- **Compound Interest**: Quarterly compounding calculation
- **Multiple Currencies**: Support for COP and USD
- **Flexible Terms**: 1-30 years investment duration
- **Real-time Validation**: Client and server-side input validation

### 📊 Interactive Visualization
- **Dynamic Charts**: Powered by Recharts library
- **Growth Projection**: Year-over-year investment value tracking
- **Key Metrics**: ROI percentage, quarterly income, total returns
- **Responsive Design**: Mobile-friendly chart rendering

### 🎨 Design System Integration
- **Good Energy Branding**: Consistent color palette and typography
- **Framer Motion**: Smooth animations and transitions
- **Glassmorphism**: Modern backdrop blur effects
- **Accessibility**: WCAG compliant form controls

## File Structure

```
components/
├── simulator/
│   ├── types.ts                 # TypeScript interfaces
│   ├── InvestmentForm.tsx       # Main calculator form
│   ├── SimulationChart.tsx      # Data visualization component
│   ├── ResultCard.tsx           # Investment results display
│   └── README.md               # This documentation
├── InvestmentSimulatorPage.tsx  # Main page component
app/
├── investment-simulator/
│   └── page.tsx                # Next.js route page
└── api/
    └── simulator/
        └── route.ts            # API endpoint for calculations
```

## API Endpoints

### POST `/api/simulator`
Calculate investment returns based on user input.

**Request Body:**
```json
{
  "principal": 1000000,
  "years": 5,
  "annualRate": 12,
  "currency": "COP"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "principal": 1000000,
    "totalReturn": 1762342,
    "totalProfit": 762342,
    "annualRate": 12,
    "years": 5,
    "currency": "COP",
    "quarterlyIncome": 38117,
    "yearlyData": [
      { "year": 1, "value": 1126825, "profit": 126825 },
      // ... more years
    ]
  }
}
```

## Components Documentation

### InvestmentForm.tsx
Interactive form component for investment parameters input.

**Props:**
- `onSimulate: (input: SimulationInput) => void` - Callback when form is submitted
- `isLoading?: boolean` - Loading state display

**Features:**
- Real-time validation with error messages
- Currency conversion display
- Animated submit states
- Accessibility-compliant form controls

### SimulationChart.tsx
Chart visualization component using Recharts library.

**Props:**
- `data: SimulationData` - Simulation results to visualize

**Features:**
- Area chart for total value progression
- Dashed line for profit tracking
- Custom tooltips with formatted currency
- Responsive container with mobile optimization

### ResultCard.tsx
Summary component displaying key investment metrics.

**Props:**
- `data: SimulationData` - Simulation results to display

**Features:**
- Animated metric cards
- Trust indicators and badges
- Percentage calculations
- Mobile-responsive grid layout

## Usage Example

```typescript
import InvestmentSimulatorPage from '@/components/InvestmentSimulatorPage';

// In your page component
export default function SimulatorPage() {
  return <InvestmentSimulatorPage />;
}
```

## Calculation Logic

The ROI calculation uses the compound interest formula with quarterly compounding:

```
A = P(1 + r/n)^(nt)
```

Where:
- `A` = Final amount
- `P` = Principal investment
- `r` = Annual interest rate (decimal)
- `n` = Number of times interest compounds per year (4 for quarterly)
- `t` = Time in years

## Design Tokens

### Colors (from Tailwind Config)
- `good-green`: #005461 (Primary brand color)
- `good-lime`: #D8DA00 (Accent/CTA color)
- `good-white`: #FFFDF0 (Background)
- `good-dark-green`: #0D4651 (Text/contrast)

### Typography
- Font Family: Unbounded (Variable weight)
- Weights: normal (400), semibold (600), bold (700)

## Performance Considerations

- **Lazy Loading**: Components load on demand
- **Memoization**: Expensive calculations are memoized
- **Responsive Images**: Optimized background assets
- **API Caching**: Server responses include proper cache headers

## SEO Optimization

- **Meta Tags**: Comprehensive metadata for social sharing
- **Structured Data**: Investment calculator schema markup
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Performance**: Optimized Core Web Vitals

## Security

- **Input Validation**: Both client and server-side validation
- **Rate Limiting**: API endpoint protection (recommended)
- **Data Sanitization**: All user inputs are sanitized
- **HTTPS**: Secure data transmission

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest)
- **Mobile**: iOS Safari, Chrome Mobile
- **Fallbacks**: Graceful degradation for older browsers

## Future Enhancements

### Planned Features
- **PDF Export**: Generate investment reports
- **Email Integration**: Send simulation results
- **User Accounts**: Save and compare simulations
- **PayU Integration**: Direct investment flow
- **Multi-language**: English translation support

### Technical Improvements
- **Testing**: Unit and integration test coverage
- **Analytics**: Event tracking for user interactions
- **A/B Testing**: Conversion optimization experiments
- **Caching**: Redis-based result caching

## Contributing

When making changes to the Investment Simulator:

1. **Maintain Design Consistency**: Use existing Good Energy design tokens
2. **Update Documentation**: Keep this README current
3. **Test Responsiveness**: Verify mobile and desktop layouts
4. **Validate Calculations**: Ensure mathematical accuracy
5. **Check Accessibility**: Test with screen readers and keyboard navigation

## Support

For questions or issues related to the Investment Simulator:
- Review this documentation
- Check existing component implementations
- Test API endpoints with provided examples
- Verify design system integration