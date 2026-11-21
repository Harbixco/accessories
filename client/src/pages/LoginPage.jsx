import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(email, password);
      if (data?.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials / Ungültige Anmeldedaten.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-gray-200 pb-3">
        <h1 className="text-xl font-bold text-gray-900">{t('login.title')}</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded">
          {error}
        </div>
      )}

      {/* SHOPWARE 2-COLUMN AUTH BOX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Ich bin bereits Kunde / I am already a customer */}
        <div className="bg-white border border-gray-200 rounded p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">
            {t('login.existingHeader')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {t('login.emailLabel')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('login.emailPlaceholder')}
                className="w-full border border-gray-300 rounded p-2 text-xs text-gray-800"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {t('login.passwordLabel')}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded p-2 text-xs text-gray-800"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0B1E3F] hover:bg-[#162e5b] text-white py-2 rounded text-xs font-bold transition cursor-pointer"
              >
                {loading ? t('login.submitting') : t('login.submit')}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Ich bin Neukunde / I am a new customer */}
        <div className="bg-white border border-gray-200 rounded p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">
              {t('login.newHeader')}
            </h2>
            <p className="text-xs text-gray-600 mt-3 leading-relaxed">
              {t('login.newSubtitle')}
            </p>
            <ul className="text-xs text-gray-600 space-y-1.5 mt-3">
              <li>• {t('login.benefit1')}</li>
              <li>• {t('login.benefit2')}</li>
              <li>• {t('login.benefit3')}</li>
              <li>• {t('login.benefit4')}</li>
            </ul>
          </div>

          <div className="pt-4">
            <Link
              to="/register"
              className="block text-center w-full bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 py-2 rounded text-xs font-bold transition"
            >
              {t('login.proceedRegister')}
            </Link>
          </div>
        </div>
      </div>

      {/* Discrete Demo Quick Fill */}
      <div className="border-t border-gray-200 pt-4 text-xs text-gray-500">
        <span className="font-semibold block mb-1.5">{t('login.demoHeader')}</span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fillDemo('dealer@smartrepair-gmbh.de', 'dealer123Password!')}
            className="border border-gray-300 hover:border-gray-500 px-2.5 py-1 rounded bg-white text-gray-700 cursor-pointer"
          >
            [{t('login.demoApproved')}]
          </button>
          <button
            type="button"
            onClick={() => fillDemo('pending@phonehub-retail.de', 'pending123Password!')}
            className="border border-gray-300 hover:border-gray-500 px-2.5 py-1 rounded bg-white text-gray-700 cursor-pointer"
          >
            [{t('login.demoPending')}]
          </button>
          <button
            type="button"
            onClick={() => fillDemo('admin@bc-accessories.de', 'admin123Password!')}
            className="border border-gray-300 hover:border-gray-500 px-2.5 py-1 rounded bg-white text-gray-700 cursor-pointer"
          >
            [{t('login.demoAdmin')}]
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
