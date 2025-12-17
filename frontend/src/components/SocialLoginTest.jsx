import React, { useState } from 'react';
import authApi from '../api/authApi';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

const SocialLoginTest = () => {
  const [token, setToken] = useState('');
  const [provider, setProvider] = useState('google');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  // Assuming AuthContext has a login function, but we might just want to test the API directly first
  // or use the context to save user state if successful.
  // For this test component, let's just call API and show result.

  // const { login } = useAuth(); // If you want to actually log the user in to the app state
  // const navigate = useNavigate();

  const handleLogin = async () => {
    if (!token) {
        setError("Please enter an access token");
        return;
    }

    setLoading(true);
    setError(null);
    setSuccessData(null);

    try {
      const response = await authApi.loginWithSocial({
        access_token: token,
        provider: provider
      });

      console.log("Social Login Success:", response);
      setSuccessData(response);

      // Optional: actually log the user in client-side
      // if (response.start_token || response.tokens) {
      //   login(response.user, response.tokens);
      //   // navigate('/');
      // }

    } catch (err) {
      console.error("Social Login Failed:", err);
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl max-w-md w-full mx-auto mt-8 text-white">
      <h3 className="text-xl font-bold mb-4 text-center">Test Social Login (Dev Mode)</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Provider</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full p-2 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-blue-500 text-white option:text-black"
          >
            <option value="google" className="text-black">Google</option>
            <option value="facebook" className="text-black">Facebook</option>
            <option value="github" className="text-black">GitHub</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Access Token
            <a
                href="https://developers.google.com/oauthplayground"
                target="_blank"
                rel="noreferrer"
                className="ml-2 text-xs text-blue-300 hover:text-blue-200 underline"
            >
                (Get from Playground)
            </a>
          </label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your OAuth2 Access Token here..."
            className="w-full p-2 h-24 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-blue-500 text-xs font-mono"
          />
        </div>

        {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-sm text-red-200">
                Error: {error}
            </div>
        )}

        {successData && (
            <div className="p-3 bg-green-500/20 border border-green-500/50 rounded text-sm text-green-200 overflow-hidden">
                <p className="font-bold">Login Successful!</p>
                <div className="mt-1 text-xs break-all">
                    User: {successData.user?.firstName} {successData.user?.lastName}<br/>
                    Email: {successData.user?.email}
                </div>
            </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-2 px-4 rounded font-semibold transition-all ${
            loading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg'
          }`}
        >
          {loading ? 'Processing...' : `Login with ${provider}`}
        </button>
      </div>
    </div>
  );
};

export default SocialLoginTest;
