import crypto from 'crypto';

/**
 * Verify frontend token (similar to SDK's internal verifyFrontendToken)
 * Frontend tokens are in the format: userId:hash
 */
function verifyFrontendToken(frontendToken: string, apiKey: string): string | null {
  try {
    const tokenParts = frontendToken.split(':');
    if (tokenParts.length === 2) {
      const [tokenUserId, tokenHash] = tokenParts;
      
      // Hash the API key first (matching SDK implementation)
      const hashedApiKey = crypto.createHash('sha256').update(apiKey).digest('hex');
      
      // Create the expected hash using userId + hashedApiKey
      const expectedHash = crypto.createHash('sha256')
        .update(tokenUserId)
        .update(hashedApiKey)
        .digest('hex');
      
      if (tokenHash === expectedHash) {
        console.log('[SSE] Frontend token validated for user:', tokenUserId);
        return tokenUserId;
      }
    }
  } catch (error) {
    console.error('[SSE] Error verifying frontend token:', error);
  }
  return null;
}