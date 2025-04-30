import PageTransition from '../common/PageTransition';

const PrivacyPage = () => {
  return (
    <PageTransition>
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif mb-8 text-center">Privacy Policy</h1>

            <div className="prose prose-lg max-w-none">
              <p className="mb-6">
                At Sacred Healing Hub, we deeply respect your privacy. This policy outlines how we handle your information and the measures we take to protect your data.
              </p>

              <h2 className="text-2xl font-serif mb-4">Data Collection</h2>
              <p className="mb-6">
                We collect minimal information to provide our services:
              </p>
              <ul className="space-y-2 mb-6">
                <li>
                  <strong>Healing Name:</strong> The anonymous identifier you choose to represent yourself on our platform.
                </li>
                <li>
                  <strong>Reflections:</strong> The milestone reflections you choose to submit.
                </li>
                <li>
                  <strong>Chat Conversations:</strong> Only stored with your explicit consent by toggling the consent option in the chat interface.
                </li>
              </ul>

              <h2 className="text-2xl font-serif mb-4">Zero Data Retention (ZDR)</h2>
              <p className="mb-6">
                For our spiritual guidance chatbot, we implement Zero Data Retention by default:
              </p>
              <ul className="space-y-2 mb-6">
                <li>Conversations are not stored unless you explicitly provide consent.</li>
                <li>When consent is given, the data is used only for improving the guidance quality.</li>
                <li>You can revoke consent at any time by toggling the option in the chat interface.</li>
              </ul>

              <h2 className="text-2xl font-serif mb-4">Data Security</h2>
              <p className="mb-6">
                We employ industry-standard security measures to protect your information:
              </p>
              <ul className="space-y-2 mb-6">
                <li>All data is transmitted via secure HTTPS connections.</li>
                <li>We use anonymized identifiers (Healing Names) rather than personal information.</li>
                <li>Access to stored data is strictly limited and protected.</li>
              </ul>

              <h2 className="text-2xl font-serif mb-4">Third-Party Services</h2>
              <p className="mb-6">
                We utilize the following third-party services:
              </p>
              <ul className="space-y-2 mb-6">
                <li><strong>OpenAI:</strong> Powers our chatbot with Zero Data Retention settings enabled.</li>
                <li><strong>Airtable:</strong> Securely stores reflection submissions under your Healing Name.</li>
                <li><strong>Netlify:</strong> Hosts our website and handles form submissions.</li>
              </ul>

              <h2 className="text-2xl font-serif mb-4">Your Rights</h2>
              <p className="mb-6">
                You have the right to:
              </p>
              <ul className="space-y-2 mb-6">
                <li>Access any data we store about your Healing Name.</li>
                <li>Request deletion of your data at any time.</li>
                <li>Withdraw consent for conversation storage.</li>
                <li>Receive a copy of your stored reflections.</li>
              </ul>

              <h2 className="text-2xl font-serif mb-4">Contact Us</h2>
              <p className="mb-6">
                If you have questions about our privacy practices or wish to exercise your data rights, please contact us at:
              </p>
              <p className="mb-6">
                <a href="mailto:privacy@sacredhealinghub.com" className="text-primary-600 hover:underline">
                  privacy@sacredhealinghub.com
                </a>
              </p>

              <h2 className="text-2xl font-serif mb-4">Policy Updates</h2>
              <p className="mb-6">
                This privacy policy may be updated periodically. We will notify users of significant changes through our website.
              </p>

              <p className="text-sm text-neutral-500 mt-8">
                Last updated: May 15, 2025
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default PrivacyPage;