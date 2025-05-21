
/**
 * Environment configuration for the application
 * This centralizes access to environment variables and provides defaults
 */
export const env = {
  // OpenAI API Settings
  OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY || localStorage.getItem('openai_api_key') || '',
  
  // Agent Configuration
  DEFAULT_TEMPERATURE: 0.7,
  DEFAULT_MODEL: 'gpt-4o-mini' as const,
  MAX_TOKENS: 4000,
  
  // Agent System Settings
  ENABLE_DEBUG_LOGS: true,
}

/**
 * Function to validate the current environment configuration
 * Returns true if the configuration is valid
 */
export const validateEnv = () => {
  const missingVars = [];
  
  if (!env.OPENAI_API_KEY) {
    missingVars.push('OPENAI_API_KEY');
  }
  
  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
}
