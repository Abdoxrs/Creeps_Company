const validateEnv = () => {
  const required = [
    'JWT_SECRET',
    'MONGODB_URI'
  ];
  
  const optional = [
    'PORT',
    'NODE_ENV',
    'JWT_EXPIRES_IN',
    'BCRYPT_ROUNDS',
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USERNAME',
    'EMAIL_PASSWORD',
    'EMAIL_FROM'
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
  
  const emailVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USERNAME', 'EMAIL_PASSWORD'];
  const missingEmailVars = emailVars.filter(varName => !process.env[varName]);
  
  if (missingEmailVars.length > 0) {
    console.warn('⚠️  WARNING: Email configuration incomplete. Password reset will not work.');
    console.warn('   Missing:', missingEmailVars.join(', '));
  }
  
  console.log('✅ Environment variables validated');
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 JWT Expiry: ${process.env.JWT_EXPIRES_IN || '7d'}`);
};

export default validateEnv;