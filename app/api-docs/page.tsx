import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "API Documentation | Slick Solutions",
  description: "API documentation for the Slick Solutions platform",
}

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Slick Solutions API Documentation</h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
          <p className="mb-4">
            All API requests must include a valid JWT token in the Authorization header. Tokens are obtained through the
            Clerk authentication system.
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
            {`Authorization: Bearer {jwt_token}`}
          </pre>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Businesses</h2>

          <div className="border dark:border-gray-700 rounded-md p-4 mb-6">
            <h3 className="text-xl font-medium mb-2">Get Business Profile</h3>
            <p className="mb-2">
              <strong>GET</strong> /api/businesses/:id
            </p>
            <p className="mb-4">Retrieves the profile information for a specific business.</p>

            <h4 className="font-medium mb-2">Response</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
              {`{
  "id": "123abc",
  "name": "Premium Auto Detailing",
  "logo": "https://example.com/logo.png",
  "primaryColor": "#00AE98",
  "secondaryColor": "#707070",
  "address": "123 Main St, Anytown, USA",
  "phone": "555-123-4567",
  "email": "contact@premiumdetailing.com",
  "website": "https://premiumdetailing.com",
  "depositPercentage": 20,
  "requireDeposit": true,
  "subscriptionStatus": "active",
  "subscriptionTier": "premium"
}`}
            </pre>
          </div>

          <div className="border dark:border-gray-700 rounded-md p-4">
            <h3 className="text-xl font-medium mb-2">Update Business Profile</h3>
            <p className="mb-2">
              <strong>PATCH</strong> /api/businesses/:id
            </p>
            <p className="mb-4">Updates the profile information for a specific business.</p>

            <h4 className="font-medium mb-2">Request Body</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              {`{
  "name": "Premium Auto Detailing",
  "logo": "https://example.com/new-logo.png",
  "primaryColor": "#00AE98",
  "secondaryColor": "#707070",
  "address": "456 New St, Anytown, USA",
  "phone": "555-987-6543",
  "email": "new-contact@premiumdetailing.com",
  "website": "https://premiumdetailing.com",
  "depositPercentage": 25,
  "requireDeposit": true
}`}
            </pre>

            <h4 className="font-medium mb-2">Response</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
              {`{
  "id": "123abc",
  "name": "Premium Auto Detailing",
  "logo": "https://example.com/new-logo.png",
  "primaryColor": "#00AE98",
  "secondaryColor": "#707070",
  "address": "456 New St, Anytown, USA",
  "phone": "555-987-6543",
  "email": "new-contact@premiumdetailing.com",
  "website": "https://premiumdetailing.com",
  "depositPercentage": 25,
  "requireDeposit": true,
  "subscriptionStatus": "active",
  "subscriptionTier": "premium"
}`}
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Assessments</h2>

          <div className="border dark:border-gray-700 rounded-md p-4 mb-6">
            <h3 className="text-xl font-medium mb-2">Create Assessment</h3>
            <p className="mb-2">
              <strong>POST</strong> /api/assessments
            </p>
            <p className="mb-4">Creates a new vehicle assessment.</p>

            <h4 className="font-medium mb-2">Request Body</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              {`{
  "businessId": "123abc",
  "userId": "456def",
  "vehicleId": "789ghi",
  "appointmentId": "012jkl", // Optional
  "notes": "Customer reports scratches on driver side door"
}`}
            </pre>

            <h4 className="font-medium mb-2">Response</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
              {`{
  "id": "assessment_123",
  "businessId": "123abc",
  "userId": "456def",
  "vehicleId": "789ghi",
  "appointmentId": "012jkl",
  "status": "pending",
  "notes": "Customer reports scratches on driver side door",
  "recommendedServiceIds": [],
  "createdAt": 1649267123000,
  "updatedAt": 1649267123000
}`}
            </pre>
          </div>

          <div className="border dark:border-gray-700 rounded-md p-4">
            <h3 className="text-xl font-medium mb-2">Upload Assessment Media</h3>
            <p className="mb-2">
              <strong>POST</strong> /api/assessments/:id/media
            </p>
            <p className="mb-4">Uploads media files for an assessment and processes them with AI.</p>

            <h4 className="font-medium mb-2">Request Body (multipart/form-data)</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              {`{
  "files": [File1, File2, ...],
  "type": "image" // or "video"
}`}
            </pre>

            <h4 className="font-medium mb-2">Response</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
              {`{
  "media": [
    {
      "id": "media_123",
      "assessmentId": "assessment_123",
      "storageId": "storage_123",
      "type": "image",
      "aiAnalysis": "Image shows deep scratches on driver side door panel requiring paint correction",
      "createdAt": 1649267456000
    },
    {
      "id": "media_124",
      "assessmentId": "assessment_123",
      "storageId": "storage_124",
      "type": "image",
      "aiAnalysis": "Image shows minor swirl marks on hood that could be addressed with polishing",
      "createdAt": 1649267489000
    }
  ]
}`}
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Appointments</h2>

          <div className="border dark:border-gray-700 rounded-md p-4">
            <h3 className="text-xl font-medium mb-2">Schedule Appointment</h3>
            <p className="mb-2">
              <strong>POST</strong> /api/appointments
            </p>
            <p className="mb-4">Schedules a new appointment for services.</p>

            <h4 className="font-medium mb-2">Request Body</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              {`{
  "businessId": "123abc",
  "userId": "456def",
  "vehicleId": "789ghi",
  "serviceIds": ["service_1", "service_2"],
  "startTime": 1649354400000, // Unix timestamp
  "endTime": 1649361600000, // Unix timestamp
  "notes": "Please focus on the scratches on the driver side door"
}`}
            </pre>

            <h4 className="font-medium mb-2">Response</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
              {`{
  "id": "appointment_123",
  "businessId": "123abc",
  "userId": "456def",
  "vehicleId": "789ghi",
  "serviceIds": ["service_1", "service_2"],
  "startTime": 1649354400000,
  "endTime": 1649361600000,
  "status": "scheduled",
  "notes": "Please focus on the scratches on the driver side door",
  "createdAt": 1649267890000,
  "updatedAt": 1649267890000
}`}
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">AI Insights</h2>

          <div className="border dark:border-gray-700 rounded-md p-4">
            <h3 className="text-xl font-medium mb-2">Get Business Insights</h3>
            <p className="mb-2">
              <strong>GET</strong> /api/businesses/:id/insights
            </p>
            <p className="mb-4">Retrieves AI-generated insights for a business.</p>

            <h4 className="font-medium mb-2">Query Parameters</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              {`type: string // Optional, filter by insight type
limit: number // Optional, default: 10
offset: number // Optional, default: 0`}
            </pre>

            <h4 className="font-medium mb-2">Response</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
              {`{
  "insights": [
    {
      "id": "insight_123",
      "businessId": "123abc",
      "type": "revenue_forecast",
      "content": "Based on current booking trends, your revenue is projected to increase by 15% next month compared to the same period last year.",
      "metadata": {
        "confidenceScore": 0.85,
        "dataPoints": 120
      },
      "createdAt": 1649267123000,
      "expiresAt": 1651859123000
    },
    {
      "id": "insight_124",
      "businessId": "123abc",
      "type": "service_recommendation",
      "content": "Consider adding ceramic coating services. 35% of your customers who receive premium detailing would likely upgrade to ceramic coating based on their spending patterns.",
      "metadata": {
        "confidenceScore": 0.78,
        "dataPoints": 85
      },
      "createdAt": 1649267456000,
      "expiresAt": 1651859456000
    }
  ],
  "total": 24,
  "limit": 10,
  "offset": 0
}`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  )
}

