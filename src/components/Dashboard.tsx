import React, { useEffect, useState } from 'react';
import Chatbot from './Chatbot';

// Define the shape of our AI parsed data
export interface AnalysisData {
  score: number;
  skills: string[];
  skillsToLearn: Array<{ 
    step: number; 
    skill: string; 
    detailedExplanation: string;
    resourceQuery?: string;
  }>;
  strengths: Array<{ point: string; detailedExplanation: string }>;
  weaknesses: Array<{ point: string; detailedExplanation: string }>;
  recommendations: Array<{ advice: string; detailedExplanation: string }>;
  careerPaths: Array<{ role: string; matchPercentage: number; why: string }>;
  linkedInOptimization: {
    headline: string;
    about: string;
    experienceBullets: string[];
  };
  atsOptimization: string;
}

interface Props {
  data: AnalysisData;
  onReset: () => void;
}

// Custom Circular Gauge for Score
const ScoreGauge = ({ score }: { score: number }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  
  const color = score >= 80 ? 'var(--success)' : score >= 60 ? '#f59e0b' : 'var(--danger)';

  return (
    <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
      <svg height="120" width="120" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          stroke="rgba(255,255,255,0.05)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="60"
          cy="60"
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ 
            strokeDashoffset, 
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx="60"
          cy="60"
        />
      </svg>
      <div style={{ 
        position: 'absolute', 
        top: '50%', left: '50%', 
        transform: 'translate(-50%, -50%)', 
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <span style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color,
            lineHeight: 1
        }}>
          {animatedScore}
        </span>
      </div>
    </div>
  );
};

// SVG Icons
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ minWidth: '20px', marginTop: '2px' }}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ minWidth: '20px', marginTop: '2px' }}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const BulbIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ minWidth: '20px', marginTop: '2px' }}>
    <path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ minWidth: '20px', marginTop: '2px' }}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const Roadmap = ({ steps }: { steps: AnalysisData['skillsToLearn'] }) => {
  return (
    <div style={{ padding: '1rem', position: 'relative' }}>
      <div style={{ 
        position: 'absolute', left: '39px', top: '40px', bottom: '40px', 
        width: '2px', background: 'rgba(255, 255, 255, 0.1)',
        zIndex: 0
      }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'relative', zIndex: 1 }}>
        {steps?.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', animationDelay: `${i * 0.1}s` }} className="animate-in">
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '50%', 
              background: i === 0 ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 600, color: '#fff',
              flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {step.step || i + 1}
            </div>
            <div style={{ flexGrow: 1 }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem', color: i === 0 ? 'var(--success)' : '#fff' }}>
                {step.skill}
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: '1rem' }}>
                {step.detailedExplanation}
              </p>
              {step.resourceQuery && (
                <a 
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(step.resourceQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ 
                    fontSize: '0.8rem', padding: '6px 14px', 
                    background: 'rgba(255,255,255,0.05)', 
                    display: 'inline-flex', alignItems: 'center', gap: '6px' 
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>📺</span> Find Resources
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LinkedInIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#0ea5e9">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const LinkedInSurgeon = ({ data }: { data: AnalysisData['linkedInOptimization'] }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Headline Card */}
      <div className="panel interactive-panel" style={{ borderLeft: '4px solid #0ea5e9', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ color: '#0ea5e9', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🔹 Professional Headline
          </h4>
          <button onClick={() => copy(data.headline, 'headline')} className="btn" style={{ fontSize: '0.75rem', padding: '4px 10px', background: copied === 'headline' ? 'var(--success)' : 'rgba(255,255,255,0.05)' }}>
            {copied === 'headline' ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>{data.headline}</p>
      </div>

      {/* About Card */}
      <div className="panel interactive-panel" style={{ borderLeft: '4px solid #0ea5e9', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ color: '#0ea5e9', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🔹 About / Summary
          </h4>
          <button onClick={() => copy(data.about, 'about')} className="btn" style={{ fontSize: '0.75rem', padding: '4px 10px', background: copied === 'about' ? 'var(--success)' : 'rgba(255,255,255,0.05)' }}>
            {copied === 'about' ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{data.about}</div>
      </div>

      {/* Experience Bullets Card */}
      <div className="panel interactive-panel" style={{ borderLeft: '4px solid #0ea5e9', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ color: '#0ea5e9', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🔹 Platform-Optimized Experience
          </h4>
          <button onClick={() => copy(data.experienceBullets.join('\n'), 'exp')} className="btn" style={{ fontSize: '0.75rem', padding: '4px 10px', background: copied === 'exp' ? 'var(--success)' : 'rgba(255,255,255,0.05)' }}>
            {copied === 'exp' ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.experienceBullets?.map((bullet, i) => (
            <li key={i} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{bullet}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default function Dashboard({ data, onReset }: Props) {
  const [mounted, setMounted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Job Matcher State
  const [jobDescription, setJobDescription] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<{
    matchScore: number;
    missingKeywords: string[];
    coverLetter: string;
  } | null>(null);

  const [activeModal, setActiveModal] = useState<{
    title: string;
    icon: React.ReactNode;
    color: string;
    items?: Array<{ title: string; desc: string }>;
    rawHtml?: string;
  } | null>(null);

  // Job Feed State
  const [liveJobs, setLiveJobs] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [activeJobRole, setActiveJobRole] = useState('');

  // Networking State
  const [networkingDraft, setNetworkingDraft] = useState<{ email: string; linkedin: string } | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);

  // Interview Simulator State
  const [interviewMode, setInterviewMode] = useState(false);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [interviewFeedback, setInterviewFeedback] = useState<{
    score: number;
    feedbackGood: string;
    feedbackImprove: string;
  } | null>(null);
  const [sessionEnd, setSessionEnd] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-fetch jobs for the top career path if available
    if (data.careerPaths && data.careerPaths.length > 0) {
      fetchJobs(data.careerPaths[0].role);
    }
  }, []);

  const fetchJobs = async (role: string) => {
    setJobsLoading(true);
    setActiveJobRole(role);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const result = await res.json();
      if (result.jobs) {
        setLiveJobs(result.jobs);
      }
    } catch (err) {
      console.error('Job fetch error', err);
    } finally {
      setJobsLoading(false);
    }
  };

  const generateNetworkingDraft = async (job: any) => {
    setIsDrafting(true);
    try {
      const res = await fetch('/api/networking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: data, jobDetails: job })
      });
      const result = await res.json();
      if (result.email) {
        setNetworkingDraft(result);
        setActiveModal({
          title: "Personalized Outreach Drafts",
          color: "var(--success)",
          icon: <CheckIcon />,
          rawHtml: `
            <div style="display: flex; flexDirection: column; gap: 2rem;">
              <div>
                <h4 style="color: var(--success); margin-bottom: 0.5rem;">📧 Cold Email Draft</h4>
                <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); font-family: monospace; font-size: 0.9rem; white-space: pre-wrap;">${result.email}</div>
                <button class="btn" onclick="navigator.clipboard.writeText(\`${result.email.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`); alert('Email copied!');" style="margin-top: 0.5rem; font-size: 0.8rem;">Copy Email</button>
              </div>
              <div style="margin-top: 1.5rem;">
                <h4 style="color: #0ea5e9; margin-bottom: 0.5rem;">🔗 LinkedIn DM Draft</h4>
                <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); font-family: monospace; font-size: 0.9rem; white-space: pre-wrap;">${result.linkedin}</div>
                <button class="btn" onclick="navigator.clipboard.writeText(\`${result.linkedin.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`); alert('LinkedIn DM copied!');" style="margin-top: 0.5rem; font-size: 0.8rem;">Copy LinkedIn DM</button>
              </div>
            </div>
          `
        });
      }
    } catch (err) {
      console.error('Draft Error', err);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      // Dynamic import to avoid Next.js SSR "window is not defined" issues
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = document.getElementById('analysis-report-content');
      if (!element) return;

      const opt: any = {
        margin:       0.5,
        filename:     'ResumeTech_Analysis_Report.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true, 
          backgroundColor: '#000000',
          onclone: (clonedDoc: any) => {
            const panels = clonedDoc.querySelectorAll('.panel');
            panels.forEach((p: any) => {
              p.style.backdropFilter = 'none';
              p.style.webkitBackdropFilter = 'none';
              p.style.background = '#1a1a1a'; 
            });
            const allElements = clonedDoc.querySelectorAll('*');
            allElements.forEach((el: any) => {
              el.style.animation = 'none';
              if (el.style.opacity === '0') el.style.opacity = '1';
            });
          }
        },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // Apply a temporary class to fix text colors for PDF if needed, though html2canvas handles most
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF Export Error:', err);
      setIsExporting(false);
    }
  };

  const handleJobMatch = async () => {
    if (!jobDescription.trim()) return;
    setIsMatching(true);
    try {
      // Create a mock raw text version of the resume to send to the AI
      const mockResumeText = `
        Skills: ${data.skills?.join(', ')}
        Strengths: ${data.strengths?.map(s => s.point).join(', ')}
        Experience & Background context from previous analysis.
      `;
      
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: mockResumeText, jobDescription })
      });
      const resultData = await res.json();
      if (resultData.matchData) {
        setMatchResult(resultData.matchData);
      }
    } catch (err) {
      console.error('Match Error', err);
    } finally {
      setIsMatching(false);
    }
  };

  // Modal open handlers
  const openStrengths = () => setActiveModal({
    title: "Core Strengths", color: "var(--success)", icon: <CheckIcon />,
    items: data.strengths?.map(s => ({ title: s.point, desc: s.detailedExplanation })) || []
  });

  const openWeaknesses = () => setActiveModal({
    title: "Areas to Improve", color: "var(--danger)", icon: <AlertIcon />,
    items: data.weaknesses?.map(w => ({ title: w.point, desc: w.detailedExplanation })) || []
  });

  const openSkillsToLearn = () => setActiveModal({
    title: "Skills to Learn", color: "#8b5cf6", icon: <BookIcon />,
    items: data.skillsToLearn?.map(s => ({ title: s.skill, desc: s.detailedExplanation })) || []
  });

  const openRecs = () => setActiveModal({
    title: "Actionable Recommendations", color: "#f59e0b", icon: <BulbIcon />,
    items: data.recommendations?.map(r => ({ title: r.advice, desc: r.detailedExplanation })) || []
  });

  const startInterview = async () => {
    setInterviewLoading(true);
    setInterviewMode(true);
    try {
      const mockResumeText = `
        Skills: ${data.skills?.join(', ')}
        Strengths: ${data.strengths?.map(s => s.point).join(', ')}
      `;
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'generate', resumeText: mockResumeText, jobDescription: jobDescription || 'General Role' })
      });
      const result = await res.json();
      if (result.questions) {
        setInterviewQuestions(result.questions);
        setCurrentQuestionIdx(0);
        setSessionEnd(false);
        setInterviewFeedback(null);
      }
    } catch (err) {
      console.error('Interview Generation Error', err);
      setInterviewLoading(false);
      setInterviewMode(false);
      alert('Failed to generate interview questions. Please check your API token or try again.');
    } finally {
      setInterviewLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsSubmittingAnswer(true);
    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mode: 'evaluate', 
          question: interviewQuestions[currentQuestionIdx], 
          answer: userAnswer 
        })
      });
      const evaluation = await res.json();
      setInterviewFeedback(evaluation);
    } catch (err) {
      console.error('Answer Evaluation Error', err);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < interviewQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setUserAnswer('');
      setInterviewFeedback(null);
    } else {
      setSessionEnd(true);
    }
  };

  const resetInterview = () => {
    setInterviewMode(false);
    setInterviewQuestions([]);
    setCurrentQuestionIdx(0);
    setUserAnswer('');
    setInterviewFeedback(null);
    setSessionEnd(false);
  };

  return (
    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.5s ease-out', position: 'relative' }}>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideRight { from { width: 0; } to { } }
        .feature-list li { transition: transform 0.2s ease; }
        .feature-list li:hover { transform: translateX(5px); }
        .skill-badge {
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          cursor: default;
        }
        .skill-badge:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        .interactive-panel {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .interactive-panel:hover {
          transform: translateY(-2px);
          border-color: rgba(255,255,255,0.2);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
      `}</style>

      <div className="mobile-col" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '1rem' }}>
        <div className="mobile-text-center">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Analysis Results</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Detailed insights and actionable career guidance.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn-solid" 
            onClick={handleDownloadPdf} 
            disabled={isExporting}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: isExporting ? 0.7 : 1 }}
          >
            {isExporting ? 'Exporting...' : 'Download PDF'}
          </button>
          <button className="btn" onClick={onReset}>Analyze Another</button>
        </div>
      </div>

      <div id="analysis-report-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Top Section */}
      <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1.5rem' }}>
        <div className="panel animate-in mobile-p-3" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animationDelay: '0.1s' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Overall Score</h3>
          <ScoreGauge score={data.score} />
          <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Out of 100
          </div>
        </div>

        <div className="panel scrollable animate-in mobile-p-3" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', animationDelay: '0.2s' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Recognized Skills</h3>
          {data.skills?.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: 'auto', marginBottom: 'auto' }}>
              {data.skills.map((skill, i) => (
                <div key={i} className="skill-badge" style={{ animation: `fadeIn 0.5s ease-out ${i * 0.05}s both` }}>
                  {skill}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No specific skills detected.</p>
          )}
        </div>
      </div>

      {/* Main Analysis Flow */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div className="panel scrollable interactive-panel animate-in mobile-p-3" style={{ padding: '2rem', animationDelay: '0.3s' }} onClick={openStrengths}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
              ✦ <span>Core Strengths</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '8px' }}>View details</span>
          </div>
          <ul className="feature-list" style={{ listStyleType: 'none', paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.strengths?.slice(0, 3).map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                <CheckIcon />
                <span>{item.point}</span>
              </li>
            ))}
            {data.strengths?.length > 3 && (
              <li style={{ color: 'var(--success)', fontSize: '0.9rem', paddingLeft: '32px', marginTop: '0.5rem' }}>+ {data.strengths.length - 3} more...</li>
            )}
          </ul>
        </div>

        <div className="panel scrollable interactive-panel animate-in mobile-p-3" style={{ padding: '2rem', animationDelay: '0.4s' }} onClick={openWeaknesses}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
              ✦ <span>Areas to Improve</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '8px' }}>View details</span>
          </div>
          <ul className="feature-list" style={{ listStyleType: 'none', paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.weaknesses?.slice(0, 3).map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                <AlertIcon />
                <span>{item.point}</span>
              </li>
            ))}
             {data.weaknesses?.length > 3 && (
              <li style={{ color: 'var(--danger)', fontSize: '0.9rem', paddingLeft: '32px', marginTop: '0.5rem' }}>+ {data.weaknesses.length - 3} more...</li>
            )}
          </ul>
        </div>

        <div className="panel animate-in mobile-p-3" style={{ padding: '2rem', animationDelay: '0.5s', overflow: 'visible' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#8b5cf6' }}>
              ✦ <span style={{ color: 'var(--text-primary)' }}>Personalized Career Roadmap</span>
            </h3>
          </div>
          <Roadmap steps={data.skillsToLearn} />
        </div>

        <div className="panel scrollable interactive-panel animate-in mobile-p-3" style={{ padding: '2rem', animationDelay: '0.6s' }} onClick={openRecs}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
              ✦ <span>Actionable Recommendations</span>
            </h3>
             <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '8px' }}>View details</span>
          </div>
          <ul className="feature-list" style={{ listStyleType: 'none', paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.recommendations?.slice(0, 3).map((rec, i) => (
              <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                <BulbIcon />
                <span>{rec.advice}</span>
              </li>
              ))}
              {data.recommendations?.length > 3 && (
                <li style={{ color: '#f59e0b', fontSize: '0.9rem', paddingLeft: '32px', marginTop: '0.5rem' }}>+ {data.recommendations.length - 3} more...</li>
              )}
          </ul>
            
          <div style={{ 
            marginTop: '2rem', padding: '1.25rem', 
            background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)', 
            border: '1px solid rgba(255,255,255,0.15)', 
            borderRadius: '12px',
            borderLeft: '4px solid #8b5cf6',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#c4b5fd', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ✨ ATS Optimization Tip
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{data.atsOptimization}</p>
          </div>
        </div>


        <div className="panel scrollable interactive-panel animate-in mobile-p-3" style={{ padding: '2rem', borderLeft: '4px solid var(--primary-color)', animationDelay: '0.7s' }} onClick={startInterview}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🎙️</span> AI Interview Simulator
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Feeling ready? Practice with AI-generated questions tailored to your resume and this job description. Get instant feedback on your answers.
            </p>
            <button className="btn-solid" style={{ width: 'fit-content' }}>
              Start Practice Session
            </button>
        </div>

        <div className="panel scrollable animate-in mobile-p-3" style={{ padding: '2rem', animationDelay: '0.8s' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#0ea5e9' }}>✦</span> Career Alignments
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {data.careerPaths?.map((path, i) => (
              <div key={i} style={{ 
                padding: '1.25rem', 
                backgroundColor: 'rgba(255,255,255,0.02)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                borderRadius: '12px',
                transition: 'background-color 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{path.role}</strong>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{path.matchPercentage}%</span>
                </div>
                
                {/* Progress Bar Chart */}
                <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '1rem', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: mounted ? `${path.matchPercentage}%` : '0%', 
                    backgroundColor: path.matchPercentage >= 80 ? 'var(--success)' : path.matchPercentage >= 60 ? 'var(--primary-color)' : '#f59e0b',
                    borderRadius: '3px',
                    transition: 'width 1.5s cubic-bezier(0.1, 0.8, 0.2, 1)'
                  }} />
                </div>
                
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{path.why}</p>
              </div>
            ))}
            </div>
        </div>

      </div>
      </div> {/* End of analysis-report-content */}

      {/* LinkedIn Profile Surgeon Section */}
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', animationDelay: '0.8s' }} className="animate-in">
        <div className="mobile-col-start" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <LinkedInIcon />
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>LinkedIn Profile Surgeon</h2>
            <p style={{ color: 'var(--text-secondary)' }}>AI-crafted headline, summary, and experience points to dominate the recruiter search algorithm.</p>
          </div>
        </div>
        {data.linkedInOptimization ? (
          <LinkedInSurgeon data={data.linkedInOptimization} />
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
            Analyze your resume to generate LinkedIn optimization insights.
          </p>
        )}
      </div>

      {/* Real-Time Job Match Feed Section */}
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', animationDelay: '0.9s' }} className="animate-in">
        <div className="mobile-col-start" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Live Job Matches</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Based on your top career alignments, here are live opportunities you can apply for today.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {data.careerPaths?.slice(0, 3).map((path, i) => (
              <button 
                key={i} 
                onClick={() => fetchJobs(path.role)}
                style={{ 
                  padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', 
                  background: activeJobRole === path.role ? 'var(--success)' : 'rgba(255,255,255,0.05)',
                  color: activeJobRole === path.role ? '#000' : '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer', transition: 'all 0.3s ease'
                }}
              >
                {path.role}
              </button>
            ))}
          </div>
        </div>

        {jobsLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--success)', borderRadius: '50%', animation: 'borderRotate 1s linear infinite' }}></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {liveJobs.map((job, i) => (
              <div key={i} className="panel interactive-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', animationDelay: `${i * 0.1}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px', fontWeight: 800, color: 'var(--success)', fontSize: '1.2rem' }}>
                    {job.company?.[0]}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    NEW
                  </span>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>{job.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{job.company} • {job.location}</p>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {job.description?.replace(/<\/?[^>]+(>|$)/g, "")}
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--success)' }}>{job.salary}</span>
                    <a 
                      href={job.redirect_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn" 
                      style={{ padding: '6px 14px', fontSize: '0.8rem', background: 'var(--success)', color: '#000', border: 'none' }}
                    >
                      Apply Now
                    </a>
                  </div>
                  <button 
                    className="btn" 
                    onClick={() => generateNetworkingDraft(job)}
                    disabled={isDrafting}
                    style={{ width: '100%', fontSize: '0.8rem', borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}
                  >
                    {isDrafting ? 'Generating Draft...' : '✨ Draft Networking Outreach'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Target ATS Matcher Section */}
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Target ATS Matcher</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Paste a specific Job Description to see how well you align and generate a tailored cover letter.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea 
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste Job Description here..."
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '1.5rem',
              borderRadius: '16px',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--success)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              className="btn-solid" 
              onClick={handleJobMatch} 
              disabled={isMatching || !jobDescription.trim()}
              style={{ background: 'var(--success)', color: '#000', fontWeight: 700, padding: '12px 30px', opacity: isMatching ? 0.7 : 1 }}
            >
              {isMatching ? 'Analyzing Match...' : 'Run ATS Match'}
            </button>
          </div>
        </div>

        {/* Match Results Panel */}
        {matchResult && (
          <div className="panel animate-in shimmer-border" style={{ marginTop: '2rem', padding: '2rem', animationDelay: '0.1s' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: '2rem', alignItems: 'start' }}>
              
              <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Job Match Score</div>
                <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto' }}>
                  <svg height="100" width="100" style={{ transform: 'rotate(-90deg)' }}>
                    <circle stroke="rgba(255,255,255,0.1)" fill="transparent" strokeWidth="8" r="42" cx="50" cy="50" />
                    <circle stroke="var(--success)" fill="transparent" strokeWidth="8" strokeDasharray="264" strokeDashoffset={264 - ((matchResult?.matchScore || 0)/100)*264} strokeLinecap="round" r="42" cx="50" cy="50" style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))' }} />
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '1.5rem', fontWeight: 800 }}>
                    {matchResult?.matchScore}%
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertIcon /> <span style={{ color: 'var(--danger)' }}>Missing Keywords</span>
                  </h3>
                  {matchResult?.missingKeywords && matchResult.missingKeywords.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {matchResult.missingKeywords.map((kw, i) => (
                        <span key={i} style={{ padding: '4px 12px', background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', fontSize: '0.85rem' }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--success)' }}>You hit all the key terms!</p>
                  )}
                </div>

                <div>
                   <button 
                     className="btn" 
                     onClick={() => setActiveModal({
                       title: "Tailored Cover Letter", color: "var(--success)", icon: <CheckIcon />,
                       rawHtml: matchResult?.coverLetter || ""
                     })}
                   >
                     View Generated Cover Letter
                   </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Interview Simulator Overlay */}
      {interviewMode && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          backdropFilter: 'blur(15px)',
          zIndex: 1100,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '2rem',
          animation: 'fadeIn 0.4s ease-out'
        }}>
          <div style={{
            background: 'var(--panel-bg)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '24px',
            width: '100%', maxWidth: '900px',
            height: '80vh',
            boxShadow: '0 25px 70px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.1)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Interview Practice Session</h2>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  {interviewQuestions.map((_, i) => (
                    <div key={i} style={{ 
                      width: '30px', height: '4px', borderRadius: '2px',
                      background: i < currentQuestionIdx ? 'var(--success)' : i === currentQuestionIdx ? 'white' : 'rgba(255,255,255,0.1)',
                      transition: 'all 0.3s'
                    }}></div>
                  ))}
                </div>
              </div>
              <button 
                onClick={resetInterview}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer' }}
              >
                Quit Session
              </button>
            </div>

            {/* Content Area */}
            <div className="scrollable" style={{ flexGrow: 1, padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem', minHeight: 0 }}>
              {interviewLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--success)', opacity: 0.5, animation: 'pulse 1.5s infinite' }}></div>
                  <p style={{ color: 'var(--text-secondary)' }}>AI is preparing your custom interview questions...</p>
                </div>
              ) : sessionEnd ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Session Complete!</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '3rem' }}>Great job practicing. You're building muscle memory for the real thing.</p>
                    <button className="btn-solid" onClick={resetInterview} style={{ background: 'var(--success)', color: '#000', padding: '15px 40px' }}>
                        Return to Dashboard
                    </button>
                </div>
              ) : interviewQuestions.length > 0 ? (
                <>
                  <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                    <div style={{ color: 'var(--success)', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Question {currentQuestionIdx + 1}</div>
                    <h3 style={{ fontSize: '2rem', fontWeight: 600, lineHeight: 1.3, color: 'var(--text-primary)' }}>
                      {interviewQuestions[currentQuestionIdx]}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {interviewFeedback ? (
                      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
                          <span style={{ fontSize: '3rem', fontWeight: 800, color: (interviewFeedback?.score || 0) >= 80 ? 'var(--success)' : '#f59e0b' }}>{interviewFeedback?.score || 0}%</span>
                          <span style={{ color: 'var(--text-secondary)' }}>Ready Score</span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                          <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '16px' }}>
                            <h4 style={{ color: 'var(--success)', marginBottom: '0.75rem', fontWeight: 600 }}>What was good:</h4>
                            <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{interviewFeedback?.feedbackGood}</p>
                          </div>
                          <div style={{ padding: '1.5rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '16px' }}>
                            <h4 style={{ color: '#f59e0b', marginBottom: '0.75rem', fontWeight: 600 }}>How to improve:</h4>
                            <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{interviewFeedback?.feedbackImprove}</p>
                          </div>
                        </div>

                        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
                          <button className="btn-solid" onClick={nextQuestion} style={{ background: 'white', color: '#000', padding: '12px 35px' }}>
                            {currentQuestionIdx < interviewQuestions.length - 1 ? 'Next Question →' : 'Finish Session'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <textarea 
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Type your answer here as you would speak it..."
                          style={{
                            width: '100%', minHeight: '180px', padding: '1.5rem', borderRadius: '16px',
                            background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white', fontFamily: 'inherit', fontSize: '1.1rem', resize: 'none', outline: 'none'
                          }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button 
                            className="btn-solid" 
                            onClick={submitAnswer}
                            disabled={isSubmittingAnswer || !userAnswer.trim()}
                            style={{ background: 'var(--success)', color: '#000', opacity: isSubmittingAnswer ? 0.7 : 1 }}
                          >
                            {isSubmittingAnswer ? 'Evaluating...' : 'Submit Answer'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Modal Overlay Component */}
      {activeModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '2rem',
          animation: 'fadeIn 0.3s ease-out'
        }} onClick={() => setActiveModal(null)}>
          <div style={{
            background: 'var(--panel-bg)',
            border: `1px solid rgba(255,255,255,0.15)`,
            borderRadius: '24px',
            width: '100%', maxWidth: '800px',
            maxHeight: '85vh',
            boxShadow: `0 20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)`,
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            borderTop: `4px solid ${activeModal.color}`
          }} onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ padding: '2rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px', display: 'flex' }}>
                  {activeModal?.icon}
                </span>
                {activeModal?.title}
              </h2>
              <button onClick={() => setActiveModal(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '2rem', lineHeight: 1, padding: '0 10px', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="scrollable" style={{ padding: '2.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {activeModal?.rawHtml ? (
                <div style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                  {activeModal.rawHtml}
                </div>
              ) : activeModal?.items && activeModal.items.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {activeModal.items.map((item, idx) => (
                    <div key={idx} style={{ 
                      background: 'rgba(255,255,255,0.03)', 
                      border: '1px solid rgba(255,255,255,0.08)', 
                      borderRadius: '16px', 
                      padding: '1.5rem',
                      transition: 'transform 0.2s, background 0.2s',
                    }}>
                      <h4 style={{ fontSize: '1.2rem', color: activeModal?.color, marginBottom: '0.75rem', fontWeight: 600 }}>{item.title}</h4>
                      <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No detailed data available.</p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Floating AI Chatbot */}
      <Chatbot />

    </div>
  );
}
