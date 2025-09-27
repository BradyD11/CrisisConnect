import { volunteerApi } from '../services/volunteerApi';

export async function testVolunteerConnectorApi() {
  try {
    console.log('Testing Volunteer Connector API...');
    
    // Test Canadian opportunities (cc=64, ac=5 for Alberta)
    const result = await volunteerApi.getOpportunitiesByLocation('64', '5');
    
    console.log(`Found ${result.totalCount} opportunities`);
    console.log('First opportunity:', result.opportunities[0]);
    
    return result.opportunities;
  } catch (error) {
    console.error('API test failed:', error);
    return [];
  }
}

export async function testUSOpportunities() {
  try {
    console.log('Testing US opportunities...');
    
    // Test US opportunities (cc=1)
    const result = await volunteerApi.getOpportunitiesByLocation('1');
    
    console.log(`Found ${result.totalCount} US opportunities`);
    return result.opportunities;
  } catch (error) {
    console.error('US API test failed:', error);
    return [];
  }
}