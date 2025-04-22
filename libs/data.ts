export const getBuyerById = (id: string) => {
    // Mock data for buyers (same as in dashboard)
    const mockBuyers = [
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "(555) 123-4567",
        tags: [{ name: "Retail" }, { name: "VIP" }],
        company: "Acme Corp",
      },
      {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "(555) 987-6543",
        tags: [{ name: "Retail" }, { name: "New" }],
        company: "Beta Inc",
      },
      {
        id: "3",
        name: "Michael Brown",
        email: "michael.b@example.com",
        phone: "(555) 456-7890",
        tags: [{ name: "Wholesale" }],
        company: "Gamma Ltd",
      },
      {
        id: "4",
        name: "Emily Davis",
        email: "emily.d@example.com",
        phone: "(555) 234-5678",
        tags: [{ name: "Retail" }, { name: "Inactive" }],
        company: "Delta Co",
      },
      {
        id: "5",
        name: "David Wilson",
        email: "david.w@example.com",
        phone: "(555) 876-5432",
        tags: [{ name: "Wholesale" }, { name: "VIP" }],
        company: "Epsilon LLC",
      },
      {
        id: "6",
        name: "Jessica Martinez",
        email: "jessica.m@example.com",
        phone: "(555) 345-6789",
        tags: [{ name: "New" }],
        company: "Zeta Group",
      },
      {
        id: "7",
        name: "Robert Taylor",
        email: "robert.t@example.com",
        phone: "(555) 654-3210",
        tags: [{ name: "Retail" }],
        company: "Eta Systems",
      },
      {
        id: "8",
        name: "Jennifer Anderson",
        email: "jennifer.a@example.com",
        phone: "(555) 432-1098",
        tags: [{ name: "Wholesale" }, { name: "VIP" }],
        company: "Theta Solutions",
      },
      {
        id: "9",
        name: "Christopher Thomas",
        email: "chris.t@example.com",
        phone: "(555) 210-9876",
        tags: [{ name: "Retail" }, { name: "New" }],
        company: "Iota Enterprises",
      },
      {
        id: "10",
        name: "Amanda White",
        email: "amanda.w@example.com",
        phone: "(555) 789-0123",
        tags: [{ name: "Inactive" }],
        company: "Kappa Holdings",
      },
    ]
  
    return mockBuyers.find((buyer) => buyer.id === id) || null
  }
  