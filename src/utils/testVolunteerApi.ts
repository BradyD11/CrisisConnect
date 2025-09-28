import { volunteerApi } from '../services/volunteerApi';

export async function testVolunteerConnectorApi() {
  try {
    console.log('Testing Volunteer Connector API...');
    
    // Test with different country/area codes
    console.log('\n1. Testing Canadian opportunities (cc=64, ac=5 for Alberta)');
    const canadaResult = await volunteerApi.getOpportunitiesByLocation('64', '5');
    console.log(`Found ${canadaResult.totalCount} Canadian opportunities`);
    
    console.log('\n2. Testing US opportunities (cc=1)');
    const usResult = await volunteerApi.getOpportunitiesByLocation('1');
    console.log(`Found ${usResult.totalCount} US opportunities`);
    
    console.log('\n3. Testing simple search with no filters');
    const simpleResult = await volunteerApi.getOpportunities({});
    console.log(`Found ${simpleResult.totalCount} opportunities with no filters`);
    
    return simpleResult.opportunities;
  } catch (error) {
    console.error('API test failed:', error);
    return [];
  }
}

// Test function you can call from browser console
export async function debugApiCall() {
  try {
    // Direct fetch test
    const testUrl = 'https://www.volunteerconnector.org/api/search/?cc=64&ac=5';
    console.log('Direct fetch test to:', testUrl);
    
    const response = await fetch(testUrl);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Response text (first 1000 chars):', text.substring(0, 1000));
    
    try {
      const json = JSON.parse(text);
      console.log('Parsed JSON:', json);
      return json;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return text;
    }
  } catch (error) {
    console.error('Direct fetch failed:', error);
    return null;
  }
}