import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Deployment Guide | Slick Solutions",
  description: "Comprehensive deployment guide for the Slick Solutions application",
}

export default function DeploymentGuidePage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Deployment Guide</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="mb-4">
            This guide outlines the deployment process for the Slick Solutions SaaS application. The application is
            built using Next.js and deployed on Vercel, with Convex for the backend database and real-time
            functionality.
          </p>
          <p>The deployment architecture consists of:</p>
          <ul className="list-disc ml-6 space-y-1 mt-2">
            <li>Vercel for hosting the Next.js application</li>
            <li>Convex for database, storage, and serverless functions</li>
            <li>Clerk for authentication and user management</li>
            <li>Stripe for payment processing</li>
            <li>Vercel AI SDK for AI features</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Prerequisites</h2>
          <p className="mb-2">Before deploying the application, ensure you have the following:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>A Vercel account</li>
            <li>A Convex account</li>
            <li>A Clerk account</li>
            <li>A Stripe account</li>
            <li>Access to the Slick Solutions GitHub repository</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Environment Variables</h2>
          <p className="mb-4">
            The application requires several environment variables to be set up in Vercel. These variables are used for
            connecting to the various services and configuring the application.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left font-medium">Variable Name</th>
                  <th className="py-2 px-4 text-left font-medium">Description</th>
                  <th className="py-2 px-4 text-left font-medium">Required</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 px-4 font-mono text-sm">NEXT_PUBLIC_CONVEX_URL</td>
                  <td className="py-2 px-4">The URL of your Convex deployment</td>
                  <td className="py-2 px-4">Yes</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono text-sm">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</td>
                  <td className="py-2 px-4">Clerk publishable API key</td>
                  <td className="py-2 px-4">Yes</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono text-sm">CLERK_SECRET_KEY</td>
                  <td className="py-2 px-4">Clerk secret API key</td>
                  <td className="py-2 px-4">Yes</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono text-sm">CLERK_WEBHOOK_SECRET</td>
                  <td className="py-2 px-4">Secret for verifying Clerk webhooks</td>
                  <td className="py-2 px-4">Yes</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono text-sm">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</td>
                  <td className="py-2 px-4">Stripe publishable API key</td>
                  <td className="py-2 px-4">Yes</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono text-sm">STRIPE_SECRET_KEY</td>
                  <td className="py-2 px-4">Stripe secret API key</td>
                  <td className="py-2 px-4">Yes</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono text-sm">STRIPE_WEBHOOK_SECRET</td>
                  <td className="py-2 px-4">Secret for verifying Stripe webhooks</td>
                  <td className="py-2 px-4">Yes</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono text-sm">OPENAI_API_KEY</td>
                  <td className="py-2 px-4">OpenAI API key for AI features</td>
                  <td className="py-2 px-4">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Deployment Steps</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-2">1. Set Up Convex</h3>
              <ol className="list-decimal ml-6 space-y-2">
                <li>Create a new Convex project from the Convex dashboard.</li>
                <li>
                  Note the Convex deployment URL, which will be used as the{" "}
                  <code className="font-mono text-sm bg-muted px-1 py-0.5 rounded">NEXT_PUBLIC_CONVEX_URL</code>{" "}
                  environment variable.
                </li>
                <li>
                  Deploy the Convex schema by running{" "}
                  <code className="font-mono text-sm bg-muted px-1 py-0.5 rounded">npx convex deploy</code> from your
                  local development environment.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">2. Set Up Clerk</h3>
              <ol className="list-decimal ml-6 space-y-2">
                <li>Create a new application in the Clerk dashboard.</li>
                <li>Configure the authentication methods (email, social logins, etc.).</li>
                <li>Set up the JWT template to include the necessary claims for Convex.</li>
                <li>
                  Create a webhook endpoint that points to{" "}
                  <code className="font-mono text-sm bg-muted px-1 py-0.5 rounded">
                    https://your-domain.com/api/webhook/clerk
                  </code>
                  .
                </li>
                <li>Note the API keys and webhook secret, which will be used as environment variables.</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">3. Set Up Stripe</h3>
              <ol className="list-decimal ml-6 space-y-2">
                <li>Create a Stripe account if you don't have one.</li>
                <li>Set up your products and pricing plans in the Stripe dashboard.</li>
                <li>
                  Configure the webhook endpoint to point to{" "}
                  <code className="font-mono text-sm bg-muted px-1 py-0.5 rounded">
                    https://your-domain.com/api/webhook/stripe
                  </code>
                  .
                </li>
                <li>Note the API keys and webhook secret, which will be used as environment variables.</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">4. Deploy to Vercel</h3>
              <ol className="list-decimal ml-6 space-y-2">
                <li>Connect your GitHub repository to Vercel.</li>
                <li>Configure the project settings in the Vercel dashboard.</li>
                <li>Add all the required environment variables.</li>
                <li>Deploy the application.</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">5. Post-Deployment Configuration</h3>
              <ol className="list-decimal ml-6 space-y-2">
                <li>Update the Clerk redirect URLs to point to your deployed application.</li>
                <li>Update the Stripe webhook endpoint to use the deployed URL.</li>
                <li>Test the authentication flow and payment processing to ensure everything is working correctly.</li>
              </ol>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">CI/CD Pipeline</h2>
          <p className="mb-4">
            The application uses Vercel's built-in CI/CD pipeline for continuous deployment. Every push to the main
            branch triggers a new deployment.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Workflow</h3>
              <ol className="list-decimal ml-6 space-y-1">
                <li>Code is pushed to the GitHub repository.</li>
                <li>Vercel automatically detects the changes and starts the build process.</li>
                <li>The application is built and deployed to a preview URL.</li>
                <li>If the changes are pushed to the main branch, the application is deployed to production.</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Branch Previews</h3>
              <p>
                Vercel automatically creates preview deployments for each branch, allowing you to test changes before
                merging them into the main branch.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Environment Variables</h3>
              <p>
                Different environment variables can be set for different deployment environments (production, preview,
                development) in the Vercel dashboard.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Monitoring and Logging</h2>
          <p className="mb-4">
            The application uses several tools for monitoring and logging to ensure optimal performance and quick issue
            resolution.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Vercel Analytics</h3>
              <p>Vercel provides built-in analytics for monitoring application performance, including:</p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Page load times</li>
                <li>API response times</li>
                <li>Error rates</li>
                <li>User metrics</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Convex Monitoring</h3>
              <p>Convex provides monitoring tools for database operations and serverless functions, including:</p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Query performance</li>
                <li>Function execution times</li>
                <li>Error logs</li>
                <li>Database usage metrics</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Error Tracking</h3>
              <p>
                The application uses error tracking to capture and report errors in real-time. This helps identify and
                fix issues quickly.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Backup and Recovery</h2>
          <p className="mb-4">
            Data backup and recovery procedures are essential for ensuring data integrity and availability.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Convex Backups</h3>
              <p>
                Convex automatically backs up your data and provides point-in-time recovery options. This ensures that
                your data is safe and can be restored if needed.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Manual Backups</h3>
              <p>
                In addition to Convex's automatic backups, you can also create manual backups of your data using the
                Convex CLI:
              </p>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2">
                <code>npx convex export --to backup.json</code>
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Recovery Procedures</h3>
              <p>In case of data loss or corruption, you can restore your data from a backup:</p>
              <ol className="list-decimal ml-6 space-y-1 mt-2">
                <li>Identify the backup to restore from.</li>
                <li>Use the Convex dashboard or CLI to restore the data.</li>
                <li>Verify that the data has been restored correctly.</li>
              </ol>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Scaling</h2>
          <p className="mb-4">
            The application is designed to scale automatically as your user base grows. Here are some considerations for
            scaling:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Vercel Scaling</h3>
              <p>
                Vercel automatically scales your application based on traffic. There's no need to manually provision
                servers or configure load balancers.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Convex Scaling</h3>
              <p>Convex scales automatically to handle increased database load. It provides:</p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Automatic scaling of database resources</li>
                <li>Distributed query execution</li>
                <li>Efficient caching</li>
                <li>Real-time synchronization at scale</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">AI Service Scaling</h3>
              <p>
                The AI features of the application use the Vercel AI SDK, which is designed to handle high volumes of
                requests efficiently. Consider:
              </p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Implementing rate limiting for AI requests</li>
                <li>Caching common AI responses</li>
                <li>Using streaming responses for long-running AI tasks</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Security Considerations</h2>
          <p className="mb-4">
            Security is a top priority for the Slick Solutions application. Here are some security measures implemented:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Authentication</h3>
              <p>The application uses Clerk for authentication, which provides:</p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Secure user authentication</li>
                <li>Multi-factor authentication</li>
                <li>JWT-based session management</li>
                <li>Protection against common authentication attacks</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Authorization</h3>
              <p>
                The application implements role-based access control (RBAC) to ensure that users can only access the
                resources they are authorized to use.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Data Protection</h3>
              <p>The application protects sensitive data through:</p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Encryption of data in transit using HTTPS</li>
                <li>Encryption of sensitive data at rest</li>
                <li>Secure handling of payment information using Stripe</li>
                <li>Regular security audits and updates</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">API Security</h3>
              <p>The application's API endpoints are secured through:</p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Authentication checks on all protected routes</li>
                <li>Input validation to prevent injection attacks</li>
                <li>Rate limiting to prevent abuse</li>
                <li>CORS configuration to restrict access from unauthorized domains</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
          <p className="mb-4">
            Here are some common issues you might encounter during deployment and how to resolve them:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Authentication Issues</h3>
              <p className="mb-2">If users are unable to sign in or experience authentication errors:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Verify that the Clerk API keys are correctly set in the environment variables.</li>
                <li>Check that the Clerk JWT template is configured correctly for Convex.</li>
                <li>Ensure that the redirect URLs in Clerk are set to the correct domain.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Database Connection Issues</h3>
              <p className="mb-2">If the application cannot connect to the Convex database:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  Verify that the{" "}
                  <code className="font-mono text-sm bg-muted px-1 py-0.5 rounded">NEXT_PUBLIC_CONVEX_URL</code>{" "}
                  environment variable is set correctly.
                </li>
                <li>Check that the Convex deployment is active and healthy.</li>
                <li>Ensure that the Convex schema has been deployed.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Payment Processing Issues</h3>
              <p className="mb-2">If payments are not being processed correctly:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Verify that the Stripe API keys are correctly set in the environment variables.</li>
                <li>Check that the Stripe webhook endpoint is configured correctly.</li>
                <li>Ensure that the Stripe webhook secret is set correctly in the environment variables.</li>
                <li>Test the payment flow in Stripe's test mode.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">AI Feature Issues</h3>
              <p className="mb-2">If the AI features are not working correctly:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Verify that the OpenAI API key is correctly set in the environment variables.</li>
                <li>Check that the AI models being used are available and not deprecated.</li>
                <li>Monitor the API usage to ensure you're not exceeding rate limits.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

