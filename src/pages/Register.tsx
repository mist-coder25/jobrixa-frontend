import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from '../components/Toast';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // Redirect to Google OAuth endpoint
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
    window.location.href = `${apiUrl}/oauth2/authorization/google`;
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
      minHeight: '100vh',
      backgroundColor: '#0A0E27',
    }}>
      {/* Left Side - Form */}
      <div style={{
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div 
          onClick={() => navigate('/')}
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            marginBottom: '40px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#5B9FFF',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '900'
          }}>J</div>
          Jobrixa
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '8px',
        }}>
          Create an account
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#A0AEC0',
          marginBottom: '32px',
        }}>
          Start tracking your applications today
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              color: '#A0AEC0',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}>
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Your full name"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#0F1419',
                border: '1px solid #1E293B',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
              required
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              color: '#A0AEC0',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#0F1419',
                border: '1px solid #1E293B',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
              required
            />
          </div>

          {/* Password Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#A0AEC0',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#0F1419',
                  border: '1px solid #1E293B',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#A0AEC0',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}>
                Confirm
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#0F1419',
                  border: '1px solid #1E293B',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#5B9FFF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '20px',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#1E293B' }} />
            <span style={{ color: '#A0AEC0', fontSize: '14px' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#1E293B' }} />
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'transparent',
              border: '1px solid #1E293B',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '20px',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Sign In Link */}
          <p style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#A0AEC0',
          }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#5B9FFF',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>

      {/* Right Side - Info */}
      <div style={{
        backgroundColor: '#0F1419',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        borderLeft: '1px solid #1E293B'
      }}>
        {/* Icon */}
        <div style={{
          fontSize: '64px',
          marginBottom: '24px',
        }}>
          🎯
        </div>

        {/* Heading */}
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '16px',
        }}>
          Your next offer is one organized job hunt away
        </h2>

        {/* Subtitle */}
        <p style={{
          fontSize: '16px',
          color: '#A0AEC0',
          marginBottom: '32px',
          lineHeight: '1.6',
        }}>
          Stop tracking jobs in a spreadsheet. Start using a tool built for this. Join our beta and get early access to exclusive features.
        </p>

        {/* Features */}
        <div style={{
          textAlign: 'left',
          maxWidth: '400px'
        }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '16px',
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '20px', color: '#5B9FFF' }}>✓</span>
            <div>
              <p style={{
                margin: '0 0 4px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#FFFFFF',
              }}>
                Real-time application tracking
              </p>
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#A0AEC0',
              }}>
                Track every application in one place
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '16px',
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '20px', color: '#5B9FFF' }}>✓</span>
            <div>
              <p style={{
                margin: '0 0 4px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#FFFFFF',
              }}>
                Never miss a deadline
              </p>
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#A0AEC0',
              }}>
                Get alerts for OAs and interviews
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '20px', color: '#5B9FFF' }}>✓</span>
            <div>
              <p style={{
                margin: '0 0 4px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#FFFFFF',
              }}>
                100% free during beta
              </p>
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#A0AEC0',
              }}>
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
