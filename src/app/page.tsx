"use client";

import { useState } from "react";
import "./globals.css";
import FileUpload from "../components/FileUpload";
import Dashboard, { AnalysisData } from "../components/Dashboard";
import SignInModal from "../components/SignInModal";

export default function Home() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const handleSignIn = () => {
    setIsAuthenticated(true);
    setIsSignInOpen(false);
  };

  return (
    <main className="hero-padding" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "1rem 3rem" }}>
      
      <nav style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: analysisData ? "0.5rem" : "1rem", flexShrink: 0, zIndex: 10 }}>
        <div style={{ fontSize: "1.25rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", color: "var(--text-primary)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", width: "20px", height: "20px" }}>
             <div style={{background: "white", borderRadius: "2px"}}></div>
             <div style={{background: "white", borderRadius: "2px"}}></div>
             <div style={{background: "white", borderRadius: "2px"}}></div>
             <div style={{background: "rgba(255,255,255,0.4)", borderRadius: "2px"}}></div>
          </div>
          ResumeTech
        </div>
        
        {!analysisData && (
          <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
            {!isAuthenticated ? (
              <button 
                className="btn-solid" 
                style={{display: "flex", alignItems: "center", gap: "6px"}}
                onClick={() => setIsSignInOpen(true)}
              >
                Sign In
              </button>
            ) : (
              <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ display: "inline-block", width: "8px", height: "8px", backgroundColor: "var(--success)", borderRadius: "50%" }}></span>
                Signed In
              </div>
            )}
          </div>
        )}
        
        {analysisData && (
           <button className="btn" onClick={() => setAnalysisData(null)} style={{ padding: "8px 16px", borderRadius: "8px" }}>
             New Analysis
           </button>
        )}
      </nav>

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: analysisData ? "flex-start" : "center", width: "100%", zIndex: 10 }}>
        {!analysisData ? (
          <section style={{ textAlign: "center", width: "100%", maxWidth: "800px", display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1 }}>
            <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "center" }}>
              <div className="pill-badge">
                Intelligent Resume Breakdown
              </div>
            </div>
            <h1 className="hero-title" style={{ fontSize: "3.5rem", fontWeight: "600", lineHeight: "1.1", marginBottom: "0.5rem", color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
              Analysis that you<br/>need Indeed
            </h1>
            <p className="hero-subtitle" style={{ fontSize: "1.05rem", color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: "1.5", maxWidth: "600px", margin: "0 auto 1rem auto" }}>
              Elevate your career with AI-driven insights. Discover your actual market value and showcase your true potential through tailored recommendations.
            </p>
            
            <FileUpload 
              onComplete={setAnalysisData} 
              isAuthenticated={isAuthenticated} 
              onAuthRequired={() => setIsSignInOpen(true)} 
            />
          </section>
        ) : (
          <section style={{ width: "100%", paddingBottom: "3rem" }}>
            <Dashboard data={analysisData} onReset={() => setAnalysisData(null)} />
          </section>
        )}
      </div>

      <SignInModal 
        isOpen={isSignInOpen} 
        onClose={() => setIsSignInOpen(false)} 
        onSignIn={handleSignIn} 
      />
    </main>
  );
}
