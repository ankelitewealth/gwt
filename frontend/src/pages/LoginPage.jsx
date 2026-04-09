import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';

export function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode]       = useState('login');
  const [email, setEmail]     = useState('');
  const [name, setName]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') await login(email, password);
      else await register(email, name, password);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');
        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', var(--font-sans, system-ui);
          background: #f7f7f5;
        }
        @media (prefers-color-scheme: dark) {
          .login-root { background: #141413; }
          .login-panel { background: #1c1c1a !important; border-color: #2a2a28 !important; }
          .login-brand-panel { background: #111110 !important; }
          .login-input { background: #141413 !important; border-color: #2a2a28 !important; color: #e8e8e4 !important; }
          .login-input:focus { border-color: #5a9cf5 !important; box-shadow: 0 0 0 3px rgba(90,156,245,0.12) !important; }
          .login-label { color: #888780 !important; }
          .login-btn-primary { background: #5a9cf5 !important; }
          .login-btn-primary:hover { background: #4a8ce5 !important; }
          .login-btn-secondary { border-color: #2a2a28 !important; color: #888780 !important; }
          .login-btn-secondary:hover { background: #2a2a28 !important; color: #e8e8e4 !important; }
          .login-link { color: #5a9cf5 !important; }
          .login-divider { color: #444441 !important; }
          .login-divider::before, .login-divider::after { background: #2a2a28 !important; }
          .stat-card { background: rgba(255,255,255,0.04) !important; }
          .stat-value { color: #e8e8e4 !important; }
          .stat-label { color: #888780 !important; }
        }
        .login-brand-panel {
          display: none;
          flex: 1;
          background: #0f1117;
          padding: 48px;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 900px) { .login-brand-panel { display: flex; } }
        .login-panel {
          width: 100%;
          max-width: 440px;
          margin: 0 auto;
          background: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 44px;
          border-left: 0.5px solid #e8e8e4;
          min-height: 100vh;
        }
        @media (max-width: 600px) { .login-panel { padding: 32px 24px; } }
        .login-input {
          width: 100%;
          padding: 11px 14px;
          font-size: 14px;
          font-family: inherit;
          border: 1px solid #e0dfd9;
          border-radius: 8px;
          background: #fff;
          color: #1a1a18;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
        }
        .login-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.10);
        }
        .login-input::placeholder { color: #b4b2a9; }
        .login-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #5f5e5a;
          margin-bottom: 6px;
        }
        .login-btn-primary {
          width: 100%;
          padding: 12px;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s, opacity 0.15s;
          letter-spacing: 0.01em;
        }
        .login-btn-primary:hover { background: #1d4ed8; }
        .login-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }
        .login-btn-secondary {
          width: 100%;
          padding: 11px;
          font-size: 13px;
          font-family: inherit;
          background: transparent;
          color: #888780;
          border: 1px solid #e0dfd9;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .login-btn-secondary:hover { background: #f7f7f5; color: #1a1a18; }
        .login-link {
          background: none;
          border: none;
          color: #2563eb;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          padding: 0;
        }
        .login-link:hover { text-decoration: underline; }
        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          color: #b4b2a9;
          margin: 16px 0;
        }
        .login-divider::before, .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e8e8e4;
        }
        .stat-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 16px 20px;
        }
        .stat-value { font-size: 22px; font-weight: 500; color: #fff; letter-spacing: -0.02em; }
        .stat-label { font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 3px; }
        .brand-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
      `}</style>

      <div className="login-root">
        {/* Left brand panel */}
        <div className="login-brand-panel">
          <div className="brand-orb" style={{ width:400, height:400, background:'rgba(37,99,235,0.18)', top:-80, left:-80 }} />
          <div className="brand-orb" style={{ width:300, height:300, background:'rgba(16,185,129,0.12)', bottom:60, right:-40 }} />

          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2L14 7H10V16H8V7H4L9 2Z" fill="white"/>
                  <path d="M3 12H1V16H3V12ZM17 10H15V16H17V10ZM10 9H8V16H10V9Z" fill="rgba(255,255,255,0.5)"/>
                </svg>
              </div>
              <span style={{ color:'rgba(255,255,255,0.9)', fontWeight:500, fontSize:15 }}>Global Wealth Tracker</span>
            </div>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, margin:0 }}>Your portfolio. Every market.</p>
          </div>

          <div style={{ position:'relative', zIndex:1 }}>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:24, lineHeight:1.6 }}>
              Track Indian mutual funds and global ETFs in one unified dashboard — with live NAVs, FX conversion, and daily sync.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[
                { value:'4,000+', label:'Indian MF schemes' },
                { value:'Live', label:'AMFI & Yahoo NAVs' },
                { value:'Daily', label:'Automatic sync' },
                { value:'₹↔$', label:'Live FX conversion' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position:'relative', zIndex:1, fontSize:12, color:'rgba(255,255,255,0.25)' }}>
            © 2026 Global Wealth Tracker
          </div>
        </div>

        {/* Right auth panel */}
        <div className="login-panel">
          <div style={{ marginBottom:32 }}>
            <h1 style={{ fontSize:24, fontWeight:500, letterSpacing:'-0.02em', margin:'0 0 6px', color:'#1a1a18' }}>
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p style={{ fontSize:14, color:'#888780', margin:0 }}>
              {mode === 'login'
                ? 'Sign in to view your portfolio'
                : 'Start tracking your global investments'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {mode === 'register' && (
                <div>
                  <label className="login-label">Full name</label>
                  <input className="login-input" type="text" value={name}
                    onChange={e => setName(e.target.value)} placeholder="Rahul Sharma" autoFocus />
                </div>
              )}
              <div>
                <label className="login-label">Email address</label>
                <input className="login-input" type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoFocus={mode === 'login'} required />
              </div>
              <div>
                <label className="login-label">Password</label>
                <input className="login-input" type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'} required />
              </div>
            </div>

            {error && (
              <div style={{ marginTop:14, padding:'10px 14px', fontSize:13, borderRadius:8,
                background:'#fef2f2', color:'#b91c1c', border:'1px solid #fecaca' }}>
                {error}
              </div>
            )}

            <button type="submit" className="login-btn-primary"
              style={{ marginTop:20 }} disabled={loading}>
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {mode === 'login' && (
            <>
              <div className="login-divider">or</div>
              <button className="login-btn-secondary"
                onClick={() => { setEmail('demo@gwt.dev'); setPassword('demo1234'); }}>
                Continue with demo account
              </button>
            </>
          )}

          <p style={{ textAlign:'center', marginTop:24, fontSize:13, color:'#888780', margin:'24px 0 0' }}>
            {mode === 'login' ? (
              <>Don't have an account?{' '}
                <button className="login-link" onClick={() => { setMode('register'); setError(''); }}>
                  Register
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button className="login-link" onClick={() => { setMode('login'); setError(''); }}>
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}
