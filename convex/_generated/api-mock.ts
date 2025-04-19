// Create a mock API object with all the necessary functions
export const api = {
  aiInsights: {
    create: { args: {}, _returnType: {} },
    countByType: { args: {}, _returnType: {} },
    get: { args: {}, _returnType: {} },
    generateInsight: { args: {}, _returnType: {} },
    listByBusiness: { args: {}, _returnType: {} },
    remove: { args: {}, _returnType: {} },
  },
  assessments: {
    create: { args: {}, _returnType: {} },
    update: { args: {}, _returnType: {} },
    updateStatus: { args: {}, _returnType: {} },
    remove: { args: {}, _returnType: {} },
    removeRecommendedService: { args: {}, _returnType: {} },
    get: { args: {}, _returnType: {} },
  },
  users: {
    getByClerkId: { args: {}, _returnType: {} },
    create: { args: {}, _returnType: {} },
    update: { args: {}, _returnType: {} },
    remove: { args: {}, _returnType: {} },
    listClientsByBusiness: { args: {}, _returnType: {} },
  },
  businesses: {
    get: { args: {}, _returnType: {} },
    getBySlug: { args: {}, _returnType: {} },
    create: { args: {}, _returnType: {} },
    update: { args: {}, _returnType: {} },
    updateSubscription: { args: {}, _returnType: {} },
  },
  vehicles: {
    get: { args: {}, _returnType: {} },
    listByUser: { args: {}, _returnType: {} },
  },
  appointments: {
    get: { args: {}, _returnType: {} },
  },
  invoices: {
    get: { args: {}, _returnType: {} },
    updateStatus: { args: {}, _returnType: {} },
    updateDepositPaid: { args: {}, _returnType: {} },
  },
  payments: {
    create: { args: {}, _returnType: {} },
  },
  vectorSearch: {
    similarAssessments: { args: {}, _returnType: {} },
    similarServices: { args: {}, _returnType: {} },
    similarVehicles: { args: {}, _returnType: {} },
  },
  media: {
    remove: { args: {}, _returnType: {} },
  },
}

