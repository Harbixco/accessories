import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    legalForm: 'GmbH',
    vatId: '',
    contactName: '',
    email: '',
    password: '',
    phone: '',
    street: '',
    postalCode: '',
    city: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register({
        companyName: formData.companyName,
        legalForm: formData.legalForm,
        vatId: formData.vatId,
        contactName: formData.contactName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        billingAddress: {
          street: formData.street,
          postalCode: formData.postalCode,
          city: formData.city,
          country: 'Germany',
        },
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-gray-200 pb-3">
        <h1 className="text-xl font-bold text-gray-900">{t('register.title')}</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {t('register.subtitle')}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded p-6 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="font-semibold text-gray-700 block mb-1">
              {t('register.companyName')}
            </label>
            <input
              type="text"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. MobileFix GmbH"
              className="w-full border border-gray-300 rounded p-2 text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              {t('register.legalForm')}
            </label>
            <select
              name="legalForm"
              value={formData.legalForm}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 text-xs bg-white"
            >
              <option value="GmbH">GmbH</option>
              <option value="UG">UG (haftungsbeschränkt)</option>
              <option value="Einzelunternehmen">Einzelunternehmen</option>
              <option value="GbR">GbR</option>
              <option value="AG">AG</option>
              <option value="Other">Other / EU / Ltd.</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              {t('register.vatId')}
            </label>
            <input
              type="text"
              name="vatId"
              required
              value={formData.vatId}
              onChange={handleChange}
              placeholder="DE123456789"
              className="w-full border border-gray-300 rounded p-2 text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              {t('register.contactName')}
            </label>
            <input
              type="text"
              name="contactName"
              required
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Max Mustermann"
              className="w-full border border-gray-300 rounded p-2 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              {t('register.email')}
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="purchasing@company.com"
              className="w-full border border-gray-300 rounded p-2 text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              {t('register.phone')}
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+49 69 1234567"
              className="w-full border border-gray-300 rounded p-2 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-gray-700 block mb-1">
            {t('register.password')}
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            value={formData.password}
            onChange={handleChange}
            placeholder={t('register.minChars')}
            className="w-full border border-gray-300 rounded p-2 text-xs"
          />
        </div>

        <div className="border-t border-gray-100 pt-3">
          <span className="font-bold text-gray-800 block mb-2">{t('register.billingSection')}</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-3">
              <input
                type="text"
                name="street"
                required
                value={formData.street}
                onChange={handleChange}
                placeholder={t('register.street')}
                className="w-full border border-gray-300 rounded p-2 text-xs"
              />
            </div>
            <div>
              <input
                type="text"
                name="postalCode"
                required
                value={formData.postalCode}
                onChange={handleChange}
                placeholder={t('register.postalCode')}
                className="w-full border border-gray-300 rounded p-2 text-xs"
              />
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder={t('register.city')}
                className="w-full border border-gray-300 rounded p-2 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B1E3F] hover:bg-[#162e5b] text-white py-2.5 rounded text-xs font-bold transition cursor-pointer"
          >
            {loading ? t('register.submitting') : t('register.submit')}
          </button>
        </div>

        <p className="text-[11px] text-gray-500 text-center">
          {t('register.alreadyRegistered')}{' '}
          <Link to="/login" className="text-[#0B1E3F] underline font-semibold">
            {t('register.logInHere')}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
