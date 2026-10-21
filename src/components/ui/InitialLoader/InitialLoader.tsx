'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import styles from './InitialLoader.module.css';

interface InitialLoaderProps {
  /** Maximum display time in milliseconds before automatic dismissal (default: 3000ms) */
  maxDurationMs?: number;
  /** Whether to show only once per browser session (default: false so it plays on initial load/refresh) */
  oncePerSession?: boolean;
}

export default function InitialLoader({
  maxDurationMs = 3000,
  oncePerSession = false,
}: InitialLoaderProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);

  const dismissLoader = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    setFading(true);
    setTimeout(() => {
      setVisible(false);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    }, 450);
  }, []);

  useEffect(() => {
    // Check if session storage indicates it already ran this session
    if (oncePerSession && typeof window !== 'undefined') {
      try {
        const hasLoaded = sessionStorage.getItem('payperhub_initial_loaded');
        if (hasLoaded) {
          setVisible(false);
          return;
        }
        sessionStorage.setItem('payperhub_initial_loaded', 'true');
      } catch {
        // Ignore storage access errors
      }
    }

    // Lock scrolling while loader is visible
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }

    // Attempt video playback immediately
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.playbackRate = 1.0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if browser requires interaction
        });
      }
    }

    // Safety timeout: dismiss automatically if video ends or takes too long
    const timer = setTimeout(() => {
      dismissLoader();
    }, maxDurationMs);

    return () => {
      clearTimeout(timer);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [dismissLoader, maxDurationMs, oncePerSession]);

  if (!visible) return null;

  return (
    <div
      className={`${styles.overlay} ${fading ? styles.overlayFading : ''}`}
      aria-label="Loading PayperHub"
      role="status"
    >
      <button
        type="button"
        className={styles.skipButton}
        onClick={dismissLoader}
        aria-label="Skip loading animation"
      >
        Skip ✕
      </button>

      <div className={styles.container}>
        <div className={styles.videoWrapper}>
          <video
            ref={videoRef}
            poster="/loading-poster.jpg"
            autoPlay
            muted
            playsInline
            preload="auto"
            onLoadedData={() => {
              if (videoRef.current) {
                videoRef.current.play().catch(() => {});
              }
            }}
            onEnded={dismissLoader}
            onError={dismissLoader}
            className={styles.video}
          >
            <source src="/loading.mp4" type="video/mp4" />
            <source src="/loading.webm" type="video/webm" />
            <source src="/loading.MOV" type="video/quicktime" />
          </video>
        </div>

        <div className={styles.brandInfo}>
          <Image
            src="/logo.png"
            alt="Payperhub"
            width={145}
            height={33}
            priority
            className={styles.brandLogoImg}
          />
          <div className={styles.progressBarTrack}>
            <div className={styles.progressBarFill} />
          </div>
        </div>
      </div>
    </div>
  );
}
