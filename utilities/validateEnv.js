const validateEnv = () => {
  const required = [
    'JWT_SECRET',
    'MONGODB_URI'
  ];

  const missing = required.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    console.error('\n💡 Copy .env.example to .env and fill in the values');
    process.exit(1);
  }

  if (process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters long');
  }

  console.log('✅ Environment variables validated');
};

export default validateEnv;