export default {
    register: '/register',
    login: '/login',
    messages: '/messages',
    _messages: '/messages/:id?',
    home: '/',
    dashboard: '/dashboard',
    invoices: '/invoices',
    jobs: '/jobs',
    activeJobs: '/jobs/active',
    inactiveJobs: '/jobs/inactive',
    _jobItem: {
        active: '/jobs/active/:id?',
        inactive: '/jobs/inactive/:id?'
    },
    privacyPolicy: '/privacyPolicy',
    termsOfService: '/terms',
    profile: '/profile',
    _profile: '/profile/:id',
    helpCenter: '/help',
    logout: '/logout',
    settings: '/settings',
    loginAndSecurity: '/settings',
    paymentMethods: '/settings/payment',
    additionalFeatures: '/settings/features',
    legalDocuments: '/settings/legal'
}