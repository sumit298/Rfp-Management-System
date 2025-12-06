export const parseNaturalLanguageRFP = async (input) => {
  // Mock response for testing
  return {
    title: "Office Equipment Procurement",
    description: "Procurement of laptops and monitors for new office setup",
    requirements: {
      items: [
        { name: "Laptops", quantity: 20, specs: "16GB RAM, Intel i7 processor" },
        { name: "Monitors", quantity: 15, specs: "27-inch 4K display" }
      ],
      budget: 50000,
      deliveryDays: 30,
      paymentTerms: "Net 30",
      warranty: "1 year"
    }
  };
};

export const parseVendorProposal = async (emailContent, rfpRequirements) => {
  // Mock parsing based on vendor position
  const mockResponses = [
    {
      pricing: {
        items: [
          { name: "Laptops", unitPrice: 800, quantity: 20, total: 16000 },
          { name: "Monitors", unitPrice: 300, quantity: 15, total: 4500 }
        ],
        totalCost: 20500
      },
      terms: {
        deliveryDays: 25,
        paymentTerms: "Net 30",
        warranty: "2 years"
      }
    },
    {
      pricing: {
        items: [
          { name: "Laptops", unitPrice: 850, quantity: 20, total: 17000 },
          { name: "Monitors", unitPrice: 280, quantity: 15, total: 4200 }
        ],
        totalCost: 21200
      },
      terms: {
        deliveryDays: 20,
        paymentTerms: "Net 30",
        warranty: "1 year"
      }
    },
    {
      pricing: {
        items: [
          { name: "Laptops", unitPrice: 780, quantity: 20, total: 15600 },
          { name: "Monitors", unitPrice: 320, quantity: 15, total: 4800 }
        ],
        totalCost: 20400
      },
      terms: {
        deliveryDays: 28,
        paymentTerms: "Net 30",
        warranty: "18 months"
      }
    }
  ];
  
  // Return different response based on email content
  const index = emailContent.includes('$800') ? 0 : emailContent.includes('$850') ? 1 : 2;
  return mockResponses[index];
};

export const compareProposals = async (proposals, rfpRequirements) => {
  return {
    scoredProposals: proposals.map((p, index) => ({
      proposalId: p._id,
      aiScore: [85, 78, 88][index] || 80,
      aiSummary: [
        "Best warranty coverage and competitive pricing",
        "Fastest delivery but higher cost",
        "Most cost-effective with good delivery time"
      ][index] || "Good overall proposal"
    })),
    recommendation: {
      vendorId: proposals[2]?.vendorId?._id || proposals[0]?.vendorId?._id,
      vendorName: proposals[2]?.vendorId?.name || proposals[0]?.vendorId?.name,
      reasoning: "Best balance of cost, delivery time, and warranty coverage"
    }
  };
};