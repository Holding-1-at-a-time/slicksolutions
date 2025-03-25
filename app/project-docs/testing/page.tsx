import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Testing Strategy | Slick Solutions",
  description: "Comprehensive testing strategy for the Slick Solutions application",
}

export default function TestingStrategyPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Testing Strategy</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="mb-4">
            This document outlines the testing strategy for the Slick Solutions SaaS application. It covers the
            different types of testing to be performed, the tools to be used, and the overall approach to ensuring the
            quality and reliability of the application.
          </p>
          <p>
            The testing strategy is designed to ensure that the application meets the functional and non-functional
            requirements, is free from defects, and provides a high-quality user experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Testing Levels</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-2">Unit Testing</h3>
              <p className="mb-2">
                Unit tests focus on testing individual components and functions in isolation. They verify that each unit
                of code works as expected.
              </p>
              <div className="ml-6">
                <h4 className="font-medium mb-1">Tools:</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Jest for JavaScript/TypeScript testing</li>
                  <li>React Testing Library for React component testing</li>
                </ul>

                <h4 className="font-medium mt-3 mb-1">Approach:</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Write tests for all utility functions and helper methods</li>
                  <li>Test React components in isolation</li>
                  <li>Use mocks for external dependencies</li>
                  <li>Aim for high code coverage (at least 80%)</li>
                </ul>

                <h4 className="font-medium mt-3 mb-1">Example:</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2 text-sm">
                  <code>{`// Testing a utility function
import { formatCurrency } from '@/lib/utils';

describe('formatCurrency', () => {
  it('formats a number as USD currency', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(1000.5)).toBe('$1,000.50');
    expect(formatCurrency(0)).toBe('$0.00');
  });
});

// Testing a React component
import { render, screen } from '@testing-library/react';
import PriceDisplay from '@/components/price-display';

describe('PriceDisplay', () => {
  it('renders the formatted price', () => {
    render(<PriceDisplay amount={1000} />);
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
  });
});`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Integration Testing</h3>
              <p className="mb-2">
                Integration tests verify that different parts of the application work together correctly. They test the
                interaction between components, services, and external dependencies.
              </p>
              <div className="ml-6">
                <h4 className="font-medium mb-1">Tools:</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Jest for test execution</li>
                  <li>Supertest for API testing</li>
                  <li>Mock Service Worker (MSW) for mocking API responses</li>
                </ul>

                <h4 className="font-medium mt-3 mb-1">Approach:</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Test API endpoints and their interaction with the database</li>
                  <li>Test the integration between React components</li>
                  <li>Test the integration with third-party services (Clerk, Stripe, etc.)</li>
                  <li>Use mocks for external services in development and testing environments</li>
                </ul>

                <h4 className="font-medium mt-3 mb-1">Example:</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2 text-sm">
                  <code>{`// Testing API integration
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/payment/create-payment-intent/route';

describe('Payment API', () => {
  it('creates a payment intent successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        invoiceId: 'test-invoice-id',
        paymentType: 'full',
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveProperty('clientSecret');
  });
});

// Testing component integration
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PaymentForm from '@/components/payments/payment-form';
import { ConvexProvider } from 'convex/react';

describe('PaymentForm', () => {
  it('submits payment and shows success message', async () => {
    // Mock the Convex client and Stripe
    const mockConvex = { /* ... */ };
    const mockStripe = { /* ... */ };

    render(
      <ConvexProvider client={mockConvex}>
        <PaymentForm invoiceId="test-invoice-id" />
      </ConvexProvider>
    );

    // Fill in payment details
    fireEvent.change(screen.getByLabelText(/card number/i), {
      target: { value: '4242424242424242' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByText(/pay now/i));

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/payment successful/i)).toBeInTheDocument();
    });
  });
});`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">End-to-End Testing</h3>
              <p className="mb-2">
                End-to-end tests verify that the entire application works correctly from the user's perspective. They
                simulate real user scenarios and test the application as a whole.
              </p>
              <div className="ml-6">
                <h4 className="font-medium mb-1">Tools:</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Playwright for browser automation</li>
                  <li>Cypress as an alternative option</li>
                </ul>

                <h4 className="font-medium mt-3 mb-1">Approach:</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Test critical user flows (onboarding, assessment creation, payment, etc.)</li>
                  <li>Test across different browsers and devices</li>
                  <li>Use test accounts for authentication and payment processing</li>
                  <li>Focus on high-value scenarios rather than trying to test everything</li>
                </ul>

                <h4 className="font-medium mt-3 mb-1">Example:</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2 text-sm">
                  <code>{`// Playwright E2E test
import { test, expect } from '@playwright/test';

test('user can complete onboarding', async ({ page }) => {
  // Navigate to the sign-in page
  await page.goto('/sign-in');

  // Sign in with test credentials
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Expect to be redirected to onboarding
  await expect(page).toHaveURL('/onboarding');

  // Complete onboarding form
  await page.click('text=Business Owner');
  await page.click('button:has-text("Next")');

  await page.fill('input[name="businessName"]', 'Test Business');
  await page.fill('input[name="businessEmail"]', 'business@example.com');
  await page.click('button:has-text("Next")');

  await page.fill('input[name="name"]', 'John Doe');
  await page.click('button:has-text("Complete Setup")');

  // Expect to be redirected to dashboard
  await expect(page).toHaveURL('/business/test-business/dashboard');
});`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Performance Testing</h3>
              <p className="mb-2">
                Performance tests evaluate how the application performs under various conditions. They measure response
                times, throughput, and resource utilization.
              </p>
              <div className="ml-6">
                <h4 className="font-medium mb-1">Tools:</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Lighthouse for web performance metrics</li>
                  <li>k6 for load testing</li>
                  <li>Next.js Analytics for real-world performance data</li>
                </ul>

                <h4 className="font-medium mt-3 mb-1">Approach:</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Measure and optimize Core Web Vitals (LCP, FID, CLS)</li>
                  <li>Test the application under different load conditions</li>
                  <li>Identify and fix performance bottlenecks</li>
                  <li>Set performance budgets and monitor them over time</li>
                </ul>

                <h4 className="font-medium mt-3 mb-1">Example:</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2 text-sm">
                  <code>{`// k6 load test script
import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const res = http.get('https://slick-solutions.vercel.app/');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Security Testing</h3>
              <p className="mb-2">
                Security tests identify vulnerabilities and weaknesses in the application. They help ensure that the
                application is secure against various threats.
              </p>
              <div className="ml-6">
                <h4 className="font-medium mb-1">Tools:</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>OWASP ZAP for automated security scanning</li>
                  <li>Snyk for dependency vulnerability scanning</li>
                  <li>Manual penetration testing</li>
                </ul>

                <h4 className="font-medium mt-3 mb-1">Approach:</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Regularly scan for vulnerabilities in dependencies</li>
                  <li>Test for common security issues (XSS, CSRF, SQL injection, etc.)</li>
                  <li>Implement security best practices (HTTPS, CSP, CORS, etc.)</li>
                  <li>Conduct periodic security audits</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Accessibility Testing</h3>
              <p className="mb-2">
                Accessibility tests ensure that the application is usable by people with disabilities. They verify
                compliance with accessibility standards.
              </p>
              <div className="ml-6">
                <h4 className="font-medium mb-1">Tools:</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>axe-core for automated accessibility testing</li>
                  <li>Lighthouse for accessibility audits</li>
                  <li>Manual testing with screen readers and keyboard navigation</li>
                </ul>

                <h4 className="font-medium mt-3 mb-1">Approach:</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Test for WCAG 2.1 AA compliance</li>
                  <li>Ensure keyboard navigability</li>
                  <li>Provide appropriate alternative text for images</li>
                  <li>Ensure proper color contrast</li>
                  <li>Test with screen readers</li>
                </ul>

                <h4 className="font-medium mt-3 mb-1">Example:</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2 text-sm">
                  <code>{`// Accessibility test with axe-core
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import PaymentForm from '@/components/payments/payment-form';

describe('PaymentForm accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<PaymentForm invoiceId="test-invoice-id" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Test Automation</h2>
          <p className="mb-4">
            Test automation is essential for maintaining a high level of quality while enabling rapid development. The
            following sections outline the approach to test automation.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Continuous Integration</h3>
              <p className="mb-2">
                Tests are integrated into the CI/CD pipeline to ensure that code changes are automatically tested before
                deployment.
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Unit and integration tests run on every pull request</li>
                <li>End-to-end tests run on main branch merges</li>
                <li>Performance and accessibility tests run on scheduled intervals</li>
                <li>Security scans run on dependencies and code changes</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Test Data Management</h3>
              <p className="mb-2">Proper test data management ensures that tests are reliable and repeatable.</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Use fixtures for static test data</li>
                <li>Use factories for generating dynamic test data</li>
                <li>Reset the test database before each test run</li>
                <li>Use separate test environments for different types of tests</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Test Reporting</h3>
              <p className="mb-2">Comprehensive test reporting helps identify issues and track test coverage.</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Generate test reports for each test run</li>
                <li>Track test coverage over time</li>
                <li>Integrate test results with pull request reviews</li>
                <li>Send notifications for test failures</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Testing Challenges and Strategies</h2>
          <p className="mb-4">
            Testing a complex SaaS application like Slick Solutions presents several challenges. Here are some
            strategies for addressing them:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Testing Real-time Features</h3>
              <p className="mb-2">Convex provides real-time data synchronization, which can be challenging to test.</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Use Convex's testing utilities for unit testing Convex functions</li>
                <li>Mock Convex for component testing</li>
                <li>Use end-to-end tests for testing real-time behavior</li>
                <li>Implement custom test helpers for real-time testing</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Testing AI Features</h3>
              <p className="mb-2">AI features can be non-deterministic, making them challenging to test.</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Mock AI responses for deterministic testing</li>
                <li>Test the integration with AI services, not the AI models themselves</li>
                <li>Implement fallbacks and error handling for AI features</li>
                <li>Use snapshot testing for AI-generated content</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Testing Multi-tenant Features</h3>
              <p className="mb-2">
                Multi-tenancy adds complexity to testing, as data and functionality need to be isolated between tenants.
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Test data isolation between tenants</li>
                <li>Test tenant-specific configurations</li>
                <li>Test cross-tenant functionality (for admin users)</li>
                <li>Use separate test accounts for different tenant roles</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Testing Payment Processing</h3>
              <p className="mb-2">Payment processing involves external services and sensitive data.</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Use Stripe's test mode for development and testing</li>
                <li>Test different payment scenarios (success, failure, refund, etc.)</li>
                <li>Mock Stripe webhooks for testing payment events</li>
                <li>Implement end-to-end tests for critical payment flows</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Test Coverage Goals</h2>
          <p className="mb-4">
            Setting clear test coverage goals helps ensure that the application is thoroughly tested. Here are the
            coverage goals for different parts of the application:
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left font-medium">Component</th>
                  <th className="py-2 px-4 text-left font-medium">Unit Test Coverage</th>
                  <th className="py-2 px-4 text-left font-medium">Integration Test Coverage</th>
                  <th className="py-2 px-4 text-left font-medium">E2E Test Coverage</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 px-4">Utility Functions</td>
                  <td className="py-2 px-4">90%+</td>
                  <td className="py-2 px-4">N/A</td>
                  <td className="py-2 px-4">N/A</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">React Components</td>
                  <td className="py-2 px-4">80%+</td>
                  <td className="py-2 px-4">60%+</td>
                  <td className="py-2 px-4">N/A</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">API Routes</td>
                  <td className="py-2 px-4">80%+</td>
                  <td className="py-2 px-4">80%+</td>
                  <td className="py-2 px-4">N/A</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Convex Functions</td>
                  <td className="py-2 px-4">80%+</td>
                  <td className="py-2 px-4">70%+</td>
                  <td className="py-2 px-4">N/A</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">User Flows</td>
                  <td className="py-2 px-4">N/A</td>
                  <td className="py-2 px-4">N/A</td>
                  <td className="py-2 px-4">
                    Critical flows: 100%
                    <br />
                    Other flows: 70%+
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Test Environment Setup</h2>
          <p className="mb-4">
            Proper test environment setup is essential for effective testing. Here's how the test environments are
            configured:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Local Development Environment</h3>
              <p className="mb-2">Developers run tests locally during development.</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Use Jest for unit and integration tests</li>
                <li>Use Playwright for local E2E testing</li>
                <li>Use local Convex development environment</li>
                <li>Use Stripe test mode</li>
                <li>Use Clerk development environment</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">CI Environment</h3>
              <p className="mb-2">Tests run automatically in the CI environment on code changes.</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Use GitHub Actions for CI/CD</li>
                <li>Run tests in a containerized environment</li>
                <li>Use dedicated test databases and services</li>
                <li>Cache dependencies to speed up test runs</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Staging Environment</h3>
              <p className="mb-2">A production-like environment for testing before deployment.</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Deploy to Vercel preview environments</li>
                <li>Use separate Convex deployment for staging</li>
                <li>Use test accounts for third-party services</li>
                <li>Run E2E tests against the staging environment</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Test Documentation</h2>
          <p className="mb-4">
            Proper test documentation helps ensure that tests are maintainable and understandable. Here's the approach
            to test documentation:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Test Plan</h3>
              <p className="mb-2">A high-level document outlining the testing strategy and approach.</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Define testing objectives and scope</li>
                <li>Identify test types and methodologies</li>
                <li>Establish test coverage goals</li>
                <li>Define test environments and tools</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Test Cases</h3>
              <p className="mb-2">Detailed descriptions of specific test scenarios.</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Define test objectives and preconditions</li>
                <li>Specify test steps and expected results</li>
                <li>Identify test data requirements</li>
                <li>Link to related requirements or user stories</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Test Reports</h3>
              <p className="mb-2">Summaries of test results and findings.</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Provide test execution summary</li>
                <li>Identify passed and failed tests</li>
                <li>Document defects and issues</li>
                <li>Track test coverage metrics</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Conclusion</h2>
          <p>
            This testing strategy provides a comprehensive approach to ensuring the quality and reliability of the Slick
            Solutions application. By implementing this strategy, we can deliver a high-quality product that meets the
            needs of our users and provides a seamless experience across all aspects of the application.
          </p>
        </section>
      </div>
    </div>
  )
}

