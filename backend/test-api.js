import axios from 'axios';

const BASE_URL = 'http://localhost:6000/api';

// Store IDs for testing
let vendorIds = [];
let rfpId = null;

// Test 1: Create Vendors
async function createVendors() {
  console.log('\n📝 Test 1: Creating Vendors...');
  
  // Clear existing vendors first
  try {
    await axios.delete(`${BASE_URL}/vendors`);
  } catch (error) {
    // Ignore if endpoint doesn't exist
  }
  
  const vendors = [
    {
      name: 'John Smith',
      email: 'john@techsupplies.com',
      company: 'Tech Supplies Inc',
      phone: '+1-555-0100',
      contactPerson: 'John Smith'
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah@officeequip.com',
      company: 'Office Equipment Co',
      phone: '+1-555-0200',
      contactPerson: 'Sarah Johnson'
    },
    {
      name: 'Mike Chen',
      email: 'mike@digitalsolutions.com',
      company: 'Digital Solutions Ltd',
      phone: '+1-555-0300',
      contactPerson: 'Mike Chen'
    }
  ];

  for (const vendor of vendors) {
    try {
      const response = await axios.post(`${BASE_URL}/vendors`, vendor);
      vendorIds.push(response.data.data._id);
      console.log(`✅ Created vendor: ${vendor.company} (ID: ${response.data.data._id})`);
    } catch (error) {
      console.error(`❌ Failed to create vendor ${vendor.company}:`);
      console.error('   Error:', error.response?.data || error.message);
      if (error.code === 'ECONNREFUSED') {
        console.error('   ⚠️  Backend server is not running! Start it with: npm run dev');
      }
    }
  }
}

// Test 2: Create RFP with Natural Language (AI)
async function createRFP() {
  console.log('\n📝 Test 2: Creating RFP with AI...');
  
  const naturalLanguageInput = 'I need to procure 20 laptops with 16GB RAM and Intel i7 processor, and 15 monitors 27-inch 4K for our new office. Budget is $50,000 total. Need delivery within 30 days. Payment terms should be net 30, and we need at least 1 year warranty.';
  
  try {
    const response = await axios.post(`${BASE_URL}/rfps/create`, {
      naturalLanguageInput
    });
    rfpId = response.data.data._id;
    console.log('✅ RFP Created Successfully!');
    console.log('   Title:', response.data.data.title);
    console.log('   Budget:', `$${response.data.data.requirements.budget}`);
    console.log('   Items:', response.data.data.requirements.items.length);
    console.log('   RFP ID:', rfpId);
  } catch (error) {
    console.error('❌ Failed to create RFP:', error.response?.data || error.message);
  }
}

// Test 3: Get All RFPs
async function getAllRFPs() {
  console.log('\n📝 Test 3: Getting All RFPs...');
  
  try {
    const response = await axios.get(`${BASE_URL}/rfps`);
    console.log(`✅ Found ${response.data.data.length} RFPs`);
  } catch (error) {
    console.error('❌ Failed to get RFPs:', error.response?.data || error.message);
  }
}

// Test 4: Send RFP to Vendors (Email)
async function sendRFPToVendors() {
  console.log('\n📝 Test 4: Sending RFP to Vendors...');
  
  if (!rfpId || vendorIds.length === 0) {
    console.error('❌ No RFP or vendors available');
    return;
  }
  
  try {
    const response = await axios.post(`${BASE_URL}/rfps/${rfpId}/send`, {
      vendorIds: vendorIds
    });
    console.log(`✅ RFP sent to ${vendorIds.length} vendors`);
  } catch (error) {
    console.error('❌ Failed to send RFP:', error.response?.data || error.message);
  }
}

// Test 5: Receive Vendor Proposals (AI)
async function receiveProposals() {
  console.log('\n📝 Test 5: Receiving Vendor Proposals (AI Parsing)...');
  
  if (!rfpId || vendorIds.length === 0) {
    console.error('❌ No RFP or vendors available');
    return;
  }
  
  const proposals = [
    {
      vendorId: vendorIds[0],
      emailContent: `Thank you for your RFP.

We can provide:
- 20 Laptops with 16GB RAM and Intel i7 - $800 each = $16,000
- 15 Monitors 27-inch 4K - $300 each = $4,500

Total Cost: $20,500
Delivery: 25 days
Payment Terms: Net 30
Warranty: 2 years comprehensive`
    },
    {
      vendorId: vendorIds[1],
      emailContent: `Hello,

Our proposal:
20 Laptops (16GB RAM, i7) at $850 per unit = $17,000
15 4K Monitors 27" at $280 each = $4,200

Total: $21,200
We can deliver in 20 days
Payment: Net 30
Warranty: 1 year standard`
    },
    {
      vendorId: vendorIds[2],
      emailContent: `Dear Customer,

Pricing:
Laptops (16GB, i7): $780 x 20 = $15,600
Monitors (27" 4K): $320 x 15 = $4,800

Grand Total: $20,400
Delivery time: 28 days
Payment terms: Net 30
Warranty: 18 months extended`
    }
  ];

  for (let i = 0; i < proposals.length; i++) {
    try {
      const response = await axios.post(`${BASE_URL}/proposals/receive`, {
        rfpId,
        ...proposals[i]
      });
      console.log(`✅ Proposal ${i + 1} received and parsed by AI`);
      console.log(`   Total Cost: $${response.data.data.pricing.totalCost}`);
      console.log(`   Delivery: ${response.data.data.terms.deliveryDays} days`);
    } catch (error) {
      console.error(`❌ Failed to receive proposal ${i + 1}:`, error.response?.data || error.message);
    }
  }
}

// Test 6: Get Comparison (AI)
async function getComparison() {
  console.log('\n📝 Test 6: Getting AI Comparison...');
  
  if (!rfpId) {
    console.error('❌ No RFP available');
    return;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/rfps/${rfpId}/comparison`);
    console.log('✅ AI Comparison Complete!');
    console.log('\n🏆 RECOMMENDATION:');
    console.log(`   Vendor: ${response.data.data.recommendation.vendorName}`);
    console.log(`   Reasoning: ${response.data.data.recommendation.reasoning}`);
    console.log('\n📊 SCORES:');
    response.data.data.proposals.forEach(p => {
      console.log(`   ${p.vendorId.name}: ${p.aiScore}/100`);
      console.log(`   Summary: ${p.aiSummary}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to get comparison:', error.response?.data || error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  console.log('Make sure:');
  console.log('1. MongoDB is running');
  console.log('2. Backend server is running (npm run dev)');
  console.log('3. .env file has all required variables\n');
  
  try {
    await createVendors();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await createRFP();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await getAllRFPs();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await sendRFPToVendors();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await receiveProposals();
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await getComparison();
    
    console.log('\n✅ All tests completed!');
    console.log(`\n📋 Summary:`);
    console.log(`   Vendors created: ${vendorIds.length}`);
    console.log(`   RFP ID: ${rfpId}`);
    console.log(`\n🌐 View in frontend: http://localhost:3000`);
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
  }
}

// Run tests
runTests();
