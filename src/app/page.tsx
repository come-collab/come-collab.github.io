'use client';

import React, { useState, useEffect } from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import dynamic from 'next/dynamic';

// Import components with dynamic imports to avoid SSR issues
const Hero = dynamic(() => import('./components/Hero'), { ssr: false });
const Gallery = dynamic(() => import('./components/Gallery'), { ssr: false });
const Timeline = dynamic(() => import('./components/Timeline'), { ssr: false });
const BirthdayMessage = dynamic(() => import('./components/BirthdayMessage'), { ssr: false });
const GiftUnwrap = dynamic(() => import('./components/GiftUnwrap'), { ssr: false });

// Define new sunny, colorful theme
const theme = {
  colors: {
    primary: '#FFD54F',        // Golden yellow
    secondary: '#FF9800',      // Orange
    accent1: '#4CAF50',        // Green
    accent2: '#2196F3',        // Blue
    accent3: '#E91E63',        // Pink
    background: '#FFFDE7',     // Light cream
    backgroundAlt: '#FFF9C4',  // Pale yellow
    text: '#37474F',           // Dark blue-grey
    lightText: '#607D8B',      // Blue-grey
    white: '#FFFFFF'
  },
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Nunito", sans-serif',
    accent: '"Pacifico", cursive',
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '992px',
    large: '1200px',
  },
  geometry: {
    borderRadius: '12px',
    borderRadiusLarge: '24px',
    triangleShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    circleShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  }
};

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&family=Poppins:wght@400;500;600;700&family=Pacifico&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  body {
    font-family: ${props => props.theme.fonts.body};
    overflow-x: hidden;
    color: ${props => props.theme.colors.text};
    background-color: ${props => props.theme.colors.background};
    line-height: 1.6;
    position: relative;
  }
  
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(255, 213, 79, 0.15) 0%, transparent 200px),
      radial-gradient(circle at 70% 60%, rgba(76, 175, 80, 0.1) 0%, transparent 200px),
      radial-gradient(circle at 90% 10%, rgba(33, 150, 243, 0.08) 0%, transparent 200px);
    pointer-events: none;
    z-index: -1;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.fonts.heading};
    font-weight: 700;
    color: ${props => props.theme.colors.text};
  }
  
  button {
    font-family: ${props => props.theme.fonts.body};
    cursor: pointer;
  }
  
  @keyframes floatAnimation {
    0% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-10px) rotate(2deg);
    }
    100% {
      transform: translateY(0px) rotate(0deg);
    }
  }

  @keyframes colorShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  /* Improved scrollbar */
  ::-webkit-scrollbar {
    width: 12px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundAlt};
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
    border-radius: 10px;
    border: 3px solid ${props => props.theme.colors.backgroundAlt};
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.secondary};
  }
  
  /* Add geometric shapes as decorations */
  .geometric-decoration {
    position: absolute;
    z-index: -1;
    opacity: 0.6;
    pointer-events: none;
  }
`;

// Create geometric shapes component
const GeometricDecorations = () => {
  return (
    <>
      <div className="geometric-decoration" style={{
        top: '20vh',
        left: '5vw',
        width: '60px',
        height: '60px',
        background: theme.colors.accent1,
        borderRadius: '50%',
        animation: 'floatAnimation 8s ease-in-out infinite'
      }} />
      
      <div className="geometric-decoration" style={{
        top: '40vh',
        right: '8vw',
        width: '120px',
        height: '120px',
        background: theme.colors.primary,
        borderRadius: '50% 0 50% 50%',
        transform: 'rotate(45deg)',
        animation: 'floatAnimation 12s ease-in-out infinite'
      }} />
      
      <div className="geometric-decoration" style={{
        top: '80vh',
        left: '15vw',
        width: '40px',
        height: '40px',
        background: theme.colors.accent2,
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        animation: 'floatAnimation 7s ease-in-out infinite'
      }} />
      
      <div className="geometric-decoration" style={{
        top: '65vh',
        right: '12vw',
        width: '80px',
        height: '80px',
        background: theme.colors.accent3,
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
        animation: 'floatAnimation 15s ease-in-out infinite'
      }} />
    </>
  );
};

// Add a scroll-to-top button - client-side only
const ScrollToTopButton = ({ theme }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 99,
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
        color: 'white',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
        fontSize: '24px',
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      }}
      onClick={scrollToTop}
    >
      ↑
    </div>
  );
};

// Client-side only scroll button
const DynamicScrollButton = dynamic(() => Promise.resolve(ScrollToTopButton), {
  ssr: false
});

// Dynamic geometric decorations
const DynamicGeometricDecorations = dynamic(() => Promise.resolve(GeometricDecorations), {
  ssr: false
});

// Define the main app component
const BirthdayPage = () => {
  // Customize these values for your girlfriend
  const personalInfo = {
    name: "Emma",
    birthDate: "1995-04-15",
    yourName: "John",
    surpriseGift: "Weekend Getaway to Paris",
  };
  
  const [isClient, setIsClient] = useState(false);
  
  // Only render on client side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.colors.backgroundAlt}, ${theme.colors.background})`,
        fontFamily: theme.fonts.heading
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px',
          animation: 'pulse 1.5s infinite'
        }}>
          🎂
        </div>
        <h1 style={{ 
          color: theme.colors.primary,
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          Creating Your Special Birthday Surprise...
        </h1>
        <p style={{ color: theme.colors.lightText }}>Just a moment while we prepare everything!</p>
      </div>
    );
  }
  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <div className="app-container">
        <DynamicGeometricDecorations />
        <Hero girlfriendName={personalInfo.name} birthDate={personalInfo.birthDate} />
        <Gallery />
        <Timeline />
        <BirthdayMessage girlfriendName={personalInfo.name} yourName={personalInfo.yourName} />
        <DynamicScrollButton theme={theme} />
      </div>
    </ThemeProvider>
  );
};

export default BirthdayPage;