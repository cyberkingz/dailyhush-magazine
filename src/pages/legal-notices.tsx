import { useEffect } from 'react'

export default function LegalNotices() {
  useEffect(() => {
    document.title = 'Legal Notices — DailyHush'
  }, [])

  return (
    <div className="bg-gradient-to-br from-emerald-50/80 via-emerald-50/50 to-amber-50/30 min-h-screen relative overflow-hidden">
      {/* Organic Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-emerald-400/8 rounded-full blur-3xl"></div>
      </div>

      <div className="container-prose py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-emerald-900 mb-8">Legal Notices / Mentions Légales</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-emerald-700 mb-8">
              <strong>Effective Date:</strong> January 8, 2025<br />
              <strong>Last Updated:</strong> January 8, 2025
            </p>

            <div className="bg-emerald-50/80 border-l-4 border-emerald-400 p-6 mb-8 rounded-r-lg ring-1 ring-white/40">
              <p className="text-sm text-emerald-800">
                In accordance with applicable laws and regulations, the following information is provided
                regarding the website daily-hush.com and its publisher.
              </p>
            </div>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">1. Website Publisher / Éditeur du Site</h2>
          <div className="bg-emerald-50/80 p-6 rounded-xl ring-1 ring-white/40 border border-emerald-200/60 mb-6">
            <div className="text-emerald-700 space-y-2">
              <p><strong>Legal Entity / Raison Sociale:</strong> Red Impact LLC DBA DailyHush</p>
              <p><strong>Legal Form / Forme Juridique:</strong> Limited Liability Company (LLC)</p>
              <p><strong>Company Registration / Immatriculation:</strong> 2024-001419992</p>
              <p><strong>Registered Office / Siège Social:</strong><br />
                30 N Gould St Ste R<br />
                Sheridan, Wyoming 82801<br />
                United States
              </p>
              <p><strong>Email:</strong> <a href="mailto:hello@daily-hush.com" className="text-amber-600 hover:text-amber-700">hello@daily-hush.com</a></p>
              <p><strong>Phone / Téléphone:</strong> <a href="tel:+12013670512" className="text-amber-600 hover:text-amber-700">+1 (201) 367-0512</a></p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">2. Publication Director / Directeur de la Publication</h2>
          <p className="text-emerald-700 mb-6">
            The director of publication is the legal representative of Red Impact LLC DBA DailyHush.
          </p>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">3. Website Hosting / Hébergement du Site</h2>
          <div className="bg-emerald-50/80 p-6 rounded-xl ring-1 ring-white/40 border border-emerald-200/60 mb-6">
            <div className="text-emerald-700 space-y-2">
              <p><strong>Hosting Provider / Hébergeur:</strong> Netlify, Inc.</p>
              <p><strong>Address / Adresse:</strong><br />
                44 Montgomery Street, Suite 300<br />
                San Francisco, California 94104<br />
                United States
              </p>
              <p><strong>Website:</strong> <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700">www.netlify.com</a></p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">4. Intellectual Property / Propriété Intellectuelle</h2>
          <p className="text-emerald-700 mb-4">
            All content on this website, including but not limited to text, graphics, logos, images,
            audio clips, digital downloads, and software, is the property of Red Impact LLC DBA DailyHush
            or its content suppliers and is protected by international copyright laws.
          </p>
          <p className="text-emerald-700 mb-6">
            Tous les contenus présents sur ce site, incluant notamment les textes, graphiques, logos, images,
            clips audio, téléchargements numériques et logiciels, sont la propriété de Red Impact LLC DBA DailyHush
            ou de ses fournisseurs de contenu et sont protégés par les lois internationales sur le droit d'auteur.
          </p>
          <ul className="list-disc pl-6 mb-6 text-emerald-700">
            <li><strong>Trademark / Marque:</strong> DailyHush and its logo are trademarks of Red Impact LLC</li>
            <li><strong>Copyright / Droits d'Auteur:</strong> © {new Date().getFullYear()} Red Impact LLC. All rights reserved.</li>
            <li><strong>Unauthorized Use / Utilisation Non Autorisée:</strong> Any reproduction, distribution, or unauthorized use of the content is strictly prohibited without prior written consent</li>
          </ul>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">5. Personal Data Protection / Protection des Données Personnelles</h2>
          <p className="text-emerald-700 mb-4">
            We are committed to protecting your personal data in compliance with applicable data protection laws,
            including GDPR (General Data Protection Regulation) where applicable.
          </p>
          <p className="text-emerald-700 mb-6">
            For detailed information about how we collect, use, and protect your personal data,
            please refer to our <a href="/privacy" className="text-amber-600 hover:text-amber-700">Privacy Policy</a>.
          </p>
          <div className="bg-emerald-50/80 p-6 rounded-xl ring-1 ring-white/40 border border-emerald-200/60 mb-6">
            <p className="text-emerald-700 mb-2"><strong>Data Protection Contact / Contact Protection des Données:</strong></p>
            <p className="text-emerald-700">Email: <a href="mailto:hello@daily-hush.com" className="text-amber-600 hover:text-amber-700">hello@daily-hush.com</a></p>
          </div>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">6. Cookies and Tracking Technologies / Cookies et Technologies de Suivi</h2>
          <p className="text-emerald-700 mb-6">
            This website uses cookies and similar tracking technologies to enhance your browsing experience
            and analyze website traffic. By using our website, you consent to our use of cookies in accordance
            with our Privacy Policy. You can manage your cookie preferences through your browser settings.
          </p>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">7. Limitation of Liability / Limitation de Responsabilité</h2>
          <p className="text-emerald-700 mb-4">
            While we strive to provide accurate and up-to-date information, Red Impact LLC DBA DailyHush
            makes no warranties or representations regarding the accuracy, completeness, or reliability of
            the content on this website.
          </p>
          <ul className="list-disc pl-6 mb-6 text-emerald-700">
            <li>We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of this website</li>
            <li>We are not responsible for the content of external websites linked from our site</li>
            <li>Information provided is for general informational purposes only and does not constitute professional advice</li>
          </ul>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">8. Applicable Law and Jurisdiction / Loi Applicable et Juridiction</h2>
          <p className="text-emerald-700 mb-6">
            These legal notices and the use of this website are governed by the laws of the State of Wyoming,
            United States. Any disputes arising from the use of this website shall be subject to the exclusive
            jurisdiction of the courts of Wyoming, unless otherwise required by applicable consumer protection laws.
          </p>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">9. Reporting Content / Signalement de Contenu</h2>
          <p className="text-emerald-700 mb-6">
            If you believe any content on this website violates your rights or applicable laws,
            please contact us immediately at <a href="mailto:hello@daily-hush.com" className="text-amber-600 hover:text-amber-700">hello@daily-hush.com</a> with
            a detailed description of the alleged violation.
          </p>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">10. Updates to Legal Notices / Modifications des Mentions Légales</h2>
          <p className="text-emerald-700 mb-6">
            Red Impact LLC DBA DailyHush reserves the right to modify these legal notices at any time.
            Any changes will be effective immediately upon posting on this page. The "Last Updated" date
            at the top of this page indicates when these notices were last revised.
          </p>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">11. Contact Us / Nous Contacter</h2>
          <div className="bg-emerald-50/80 p-6 rounded-xl ring-1 ring-white/40 border border-emerald-200/60">
            <p className="text-emerald-700 mb-4">
              For any questions regarding these legal notices or our website, please contact us:
            </p>
            <div className="text-emerald-700 space-y-2">
              <p><strong>Red Impact LLC DBA DailyHush</strong></p>
              <p>30 N Gould St Ste R<br />Sheridan, Wyoming 82801<br />United States</p>
              <p>Email: <a href="mailto:hello@daily-hush.com" className="text-amber-600 hover:text-amber-700">hello@daily-hush.com</a></p>
              <p>Phone: <a href="tel:+12013670512" className="text-amber-600 hover:text-amber-700">+1 (201) 367-0512</a></p>
              <p>Company Registration: 2024-001419992</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
