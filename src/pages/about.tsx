import { useEffect } from 'react'

export default function About() {
  useEffect(() => {
    document.title = 'About — DailyHush'
  }, [])

  return (
    <div className="container-prose py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About DailyHush</h1>
        
        <div className="prose prose-lg max-w-none">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
            <p className="text-lg text-gray-700 font-medium">
              Your daily dose of thoughtful content and insights.
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            At DailyHush, we believe in the power of thoughtful, well-crafted content to inspire, educate, and connect people. We curate and create daily insights that matter, helping our readers stay informed and engaged with the world around them.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What We Do</h2>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><strong>Daily Content:</strong> We publish carefully selected articles, insights, and commentary on topics that matter</li>
            <li><strong>Newsletter:</strong> Our subscribers receive curated content directly to their inbox</li>
            <li><strong>Community:</strong> We foster meaningful discussions and connections among our readers</li>
            <li><strong>Quality Focus:</strong> Every piece of content is reviewed for accuracy, relevance, and value</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Quality Over Quantity</h3>
              <p className="text-gray-700 text-sm">We prioritize well-researched, thoughtful content over volume, ensuring every piece adds real value to our readers' lives.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Authenticity</h3>
              <p className="text-gray-700 text-sm">We believe in honest, transparent communication and sharing content that reflects our genuine interests and values.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-700 text-sm">We're building more than just a readership—we're creating a community of curious, engaged individuals.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Growth</h3>
              <p className="text-gray-700 text-sm">We're committed to continuous learning and improvement, both in our content and our platform.</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Join Our Community</h2>
          <p className="text-gray-700 mb-6">
            Whether you're looking for daily inspiration, industry insights, or thoughtful commentary on current events, DailyHush has something for you. Subscribe to our newsletter to stay connected and never miss our latest content.
          </p>

          <div className="bg-yellow-50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">Get In Touch</h3>
            <p className="text-gray-700 mb-4">
              We love hearing from our readers. Whether you have feedback, suggestions, or just want to say hello, don't hesitate to reach out.
            </p>
            <p className="text-gray-700">
              Email us at <a href="mailto:hello@daily-hush.com" className="text-yellow-600 hover:text-yellow-700 font-medium">hello@daily-hush.com</a>
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Company Information</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="text-gray-700 space-y-2">
              <p><strong>Red Impact LLC DBA DailyHush</strong></p>
              <p>30 N Gould St Ste R<br />Sheridan, Wyoming, 82801</p>
              <p>Email: <a href="mailto:hello@daily-hush.com" className="text-yellow-600 hover:text-yellow-700">hello@daily-hush.com</a></p>
              <p>Phone: <a href="tel:+12013670512" className="text-yellow-600 hover:text-yellow-700">+1 201-367-0512</a></p>
              <p>Company #: 2024-001419992</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

