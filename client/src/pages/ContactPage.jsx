import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Building,
} from 'lucide-react';

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language?.startsWith('de');

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('approval');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // FAQ Accordion Open States
  const [openFaq, setOpenFaq] = useState([0, 1]); // first two open by default

  const toggleFaq = (index) => {
    if (openFaq.includes(index)) {
      setOpenFaq(openFaq.filter((i) => i !== index));
    } else {
      setOpenFaq([...openFaq, index]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 600);
  };

  const faqs = [
    { q: t('contact.faq1Q'), a: t('contact.faq1A') },
    { q: t('contact.faq2Q'), a: t('contact.faq2A') },
    { q: t('contact.faq3Q'), a: t('contact.faq3A') },
    { q: t('contact.faq4Q'), a: t('contact.faq4A') },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-[11px] text-gray-500 flex items-center space-x-1.5 border-b border-gray-200 pb-2">
        <Link to="/" className="hover:underline">{t('nav.home')}</Link>
        <ChevronRight size={12} />
        <span className="font-semibold text-gray-800">{t('contact.title')}</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          {t('contact.title')}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {t('contact.subtitle')}
        </p>
      </div>

      {/* 3 Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white border border-gray-200 rounded p-4 space-y-1.5">
          <div className="w-8 h-8 bg-blue-50 text-[#1976d2] rounded flex items-center justify-center">
            <Phone size={16} />
          </div>
          <strong className="block text-gray-900 font-bold text-[11px]">{t('contact.directHotline')}</strong>
          <p className="text-base font-extrabold text-[#0B1E3F] tracking-tight">+49 (0) 69 98765432</p>
          <span className="text-[10px] text-gray-500 flex items-center gap-1">
            <Clock size={11} />
            <span>{t('contact.hours')}</span>
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 space-y-1.5">
          <div className="w-8 h-8 bg-blue-50 text-[#1976d2] rounded flex items-center justify-center">
            <Mail size={16} />
          </div>
          <strong className="block text-gray-900 font-bold text-[11px]">{t('contact.email')}</strong>
          <p className="text-sm font-bold text-gray-800">b2b@bc-accessories.de</p>
          <span className="text-[10px] text-gray-500 block">
            {isGerman ? 'Antwort innerhalb von 2-4 Stunden' : 'Response within 2-4 hours'}
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 space-y-1.5">
          <div className="w-8 h-8 bg-blue-50 text-[#1976d2] rounded flex items-center justify-center">
            <MapPin size={16} />
          </div>
          <strong className="block text-gray-900 font-bold text-[11px]">{t('contact.warehouse')}</strong>
          <p className="text-xs text-gray-700 leading-snug">
            BC Accessories GmbH<br />Industriestraße 18<br />60327 Frankfurt am Main, Germany
          </p>
        </div>
      </div>

      {/* Contact Form & FAQ Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded p-6 text-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">
            {t('contact.formTitle')}
          </h2>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded p-6 text-center space-y-3">
              <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-emerald-900">
                {t('contact.sentSuccess')}
              </h3>
              <p className="text-xs text-emerald-700">
                {isGerman ? 'Ihr persönlicher B2B Ansprechpartner wird sich zeitnah mit Ihnen in Verbindung setzen.' : 'Your dedicated account manager will be in touch shortly.'}
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="inline-block bg-[#0B1E3F] text-white px-4 py-2 rounded text-xs font-bold cursor-pointer"
              >
                {isGerman ? 'Weitere Nachricht verfassen' : 'Send Another Message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    {isGerman ? 'Firmenname *' : 'Company Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. SmartRepair GmbH"
                    className="w-full border border-gray-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    {isGerman ? 'Ansprechpartner *' : 'Contact Person *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Max Mustermann"
                    className="w-full border border-gray-300 rounded p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    {isGerman ? 'Geschäftliche E-Mail *' : 'Business Email *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="einkauf@firma.de"
                    className="w-full border border-gray-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    {t('contact.topic')}
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs bg-white text-gray-800"
                  >
                    <option value="approval">{t('contact.topicVat')}</option>
                    <option value="order">{t('contact.topicOrder')}</option>
                    <option value="terms">{t('contact.topicTerms')}</option>
                    <option value="product">{t('contact.topicProduct')}</option>
                    <option value="other">{t('contact.topicOther')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  {t('contact.message')}
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isGerman ? 'Ihre Anfrage oder Mitteilung an unsere Händlerabteilung...' : 'Your inquiry or message...'}
                  className="w-full border border-gray-300 rounded p-2 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#0B1E3F] hover:bg-[#162e5b] text-white px-6 py-2.5 rounded text-xs font-bold transition cursor-pointer active:scale-[0.98]"
              >
                {loading ? t('contact.sending') : t('contact.sendMessage')}
              </button>
            </form>
          )}
        </div>

        {/* FAQ Accordion */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded p-6 text-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">
            {t('contact.faqTitle')}
          </h2>

          <div className="divide-y divide-gray-100">
            {faqs.map((faq, index) => {
              const isOpen = openFaq.includes(index);
              return (
                <div key={index} className="py-2.5 first:pt-0">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left font-bold text-gray-800 hover:text-[#0B1E3F] flex justify-between items-center gap-2 cursor-pointer"
                  >
                    <span className="text-xs leading-snug">{faq.q}</span>
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform ${
                        isOpen ? 'transform rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="text-[11px] text-gray-600 mt-2 leading-relaxed bg-gray-50 p-2.5 rounded border border-gray-100">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
