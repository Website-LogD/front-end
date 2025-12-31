import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MockOAuth.css';

const MockOAuth = () => {
    const { provider } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState('loading'); // loading, consent, input, redirecting
    const [customEmail, setCustomEmail] = useState('');

    const isGoogle = provider === 'Google';
    const themeClass = isGoogle ? 'google' : 'github';

    useEffect(() => {
        // Simulate initial load
        setTimeout(() => setStep('consent'), 800);
    }, []);

    const handleConfirm = (email) => {
        setStep('redirecting');
        // In a real app we'd pass the auth token/user info back
        setTimeout(() => {
            navigate('/dashboard', { state: { userEmail: email, provider } });
        }, 1500);
    };

    const handleUseAnother = () => {
        setStep('input');
    };

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (customEmail.trim()) {
            handleConfirm(customEmail);
        }
    };

    const handleBack = () => {
        setStep('consent');
        setCustomEmail('');
    };

    if (step === 'loading' || step === 'redirecting') {
        return (
            <div className={`oauth-container ${themeClass}`}>
                <div className="fa-solid fa-circle-notch fa-spin loading-spinner"></div>
                <p style={{ marginTop: '20px' }}>
                    {step === 'loading' ? `Connecting to ${provider}...` : 'Redirecting to Mission Control...'}
                </p>
            </div>
        );
    }

    return (
        <div className={`oauth-container ${themeClass}`}>
            <div className="oauth-card">
                <div className="oauth-logo">
                    <i className={`fa-brands fa-${provider.toLowerCase()}`}></i>
                </div>

                <h1 className="oauth-title">
                    {step === 'input' ? 'Sign in' : `Sign in with ${provider}`}
                </h1>

                <p className="oauth-subtitle">
                    {step === 'input'
                        ? `Enter your ${provider} account email`
                        : <>Choose an account to continue to <b>Modern Auth</b></>
                    }
                </p>

                {step === 'consent' ? (
                    <div className="account-list">
                        <div className="account-item" onClick={() => handleConfirm('admin@example.com')}>
                            <div className="account-avatar">A</div>
                            <div className="account-info">
                                <div className="account-email">admin@example.com</div>
                                <div className="account-name">Admin User</div>
                            </div>
                        </div>

                        <div className="account-item" onClick={() => handleConfirm('jane.doe@example.com')}>
                            <div className="account-avatar" style={{ background: '#0d9488' }}>J</div>
                            <div className="account-info">
                                <div className="account-email">jane.doe@example.com</div>
                                <div className="account-name">Jane Doe</div>
                            </div>
                        </div>

                        <div className="account-item" onClick={handleUseAnother}>
                            <div className="account-icon">
                                <i className="fa-regular fa-user"></i>
                            </div>
                            <div className="account-info">
                                <div className="use-another-account">Use another account</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form className="custom-input-form" onSubmit={handleCustomSubmit}>
                        <div className="input-field">
                            <input
                                type="email"
                                className="custom-input"
                                placeholder="Email or phone"
                                value={customEmail}
                                onChange={(e) => setCustomEmail(e.target.value)}
                                autoFocus
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn-link" onClick={handleBack}>
                                Back
                            </button>
                            <button type="submit" className="btn-submit">
                                Next
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default MockOAuth;
