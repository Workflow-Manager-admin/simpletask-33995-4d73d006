import React, { useEffect, useState } from "react";
import { fetchUserProfile } from "./api";

// PUBLIC_INTERFACE
/**
 * PremiumWelcomeBanner:
 * - Fetches user profile from mock API on mount
 * - Displays premium animated welcome banner with user's name and avatar (if loaded)
 * - Gracefully handles loading shimmer and error state
 * - Polished style with fade+slide animation, responsive, theme-aware
 */
function PremiumWelcomeBanner() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchUserProfile()
      .then(data => {
        if (mounted) {
          setProfile(data);
          setApiError(null);
        }
      })
      .catch(e => {
        if (mounted) setApiError(e.message || "Could not load user profile.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
        // Delay animateIn for natural effect
        setTimeout(() => { if (mounted) setAnimateIn(true); }, 100);
      });
    return () => { mounted = false; };
  }, []);

  // Animation classes
  const bannerClass =
    "premium-welcome-banner" +
    (loading ? " loading" : "") +
    (apiError ? " error" : "") +
    (animateIn && !loading && !apiError ? " show" : "");

  return (
    <div className={bannerClass} role="region" aria-live="polite">
      {loading ? (
        <div className="premium-welcome-shimmer">
          <div className="profile-pic shimmer" />
          <div className="text-group">
            <div className="shimmer line1" />
            <div className="shimmer line2" />
          </div>
        </div>
      ) : apiError ? (
        <div className="premium-welcome-fail">
          <span role="img" aria-label="Error" style={{marginRight: 6}}>⚠️</span>
          Welcome unavailable. <span style={{fontSize: 12}}>{apiError}</span>
        </div>
      ) : (
        <div className="premium-welcome-main">
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt={`${profile.username}'s avatar`}
              className="profile-pic"
              width={45}
              height={45}
              style={{
                background: "var(--card-bg)",
                borderRadius: "50%",
                marginRight: 15,
                border: "2px solid var(--accent)",
                boxShadow: "0 1px 6px #0ca2d944",
                objectFit: "cover"
              }}
            />
          )}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <span className="banner-greeting">
              👋 Welcome back,
              <span className="name">{profile.username.split(" ")[0]}</span>!
            </span>
            <span className="banner-caption">
              Wishing you a productive day.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PremiumWelcomeBanner;
