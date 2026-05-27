// config.ts — Good Energy platform configuration

const isPlaceholderDeployment = typeof window === 'undefined'
  ? // Server-side check
    (process.env.CLERK_SECRET_KEY === 'sk_test_placeholder' ||
     process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === 'pk_test_placeholder' ||
     process.env.CLERK_SECRET_KEY?.includes('placeholder') ||
     process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes('placeholder'))
  : // Client-side check
    (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === 'pk_test_placeholder' ||
     process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes('placeholder'));

const config = {
  auth: {
    enabled: !isPlaceholderDeployment,
  },
  platform: {
    name: 'Good Energy',
    tagline: 'Invierte en Energía Solar',
  },
};

export default config;
