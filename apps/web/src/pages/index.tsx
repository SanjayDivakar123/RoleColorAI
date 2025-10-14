import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '@/lib/supabase';
import { Upload, Sparkles, Download, Users } from 'lucide-react';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">RoleColorAI</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.push('/auth')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/auth')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Resume with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RoleColor Intelligence
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The world's first AI that rewrites resumes through a team-role lens. 
            Highlight what makes you distinct as a Builder, Enabler, Thriver, or Supportee.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            Start Rewriting Your Resume
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Upload</h3>
            <p className="text-gray-600">
              Upload your resume in PDF, DOCX, or TXT format. Our AI extracts and analyzes your content.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Rewriting</h3>
            <p className="text-gray-600">
              Advanced OpenAI technology rewrites your resume to emphasize your unique RoleColor strengths.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">RoleColor Profiles</h3>
            <p className="text-gray-600">
              Highlight your role as a Builder, Enabler, Thriver, or Supportee based on your assessment.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Export</h3>
            <p className="text-gray-600">
              Download your optimized resume as PDF or DOCX, ready for ATS systems and recruiters.
            </p>
          </div>
        </div>

        {/* RoleColor Explanation */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Discover Your RoleColor
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <h3 className="text-lg font-semibold text-orange-600 mb-2">Builders</h3>
              <p className="text-gray-600 text-sm">
                Innovation, leadership, strategy, and vision-driven professionals who create and transform.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Enablers</h3>
              <p className="text-gray-600 text-sm">
                Collaboration, execution, and bridge-building experts who make things happen.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">Thrivers</h3>
              <p className="text-gray-600 text-sm">
                Adaptability, resilience, and results under pressure define these dynamic performers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h3 className="text-lg font-semibold text-purple-600 mb-2">Supportees</h3>
              <p className="text-gray-600 text-sm">
                Reliability, consistency, and dependability form the backbone of stable teams.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            © 2024 RoleColorFinder. All rights reserved. 
            <span className="block mt-2 text-sm">
              Mission: To create the world's first AI that rewrites resumes through a team-role lens.
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
