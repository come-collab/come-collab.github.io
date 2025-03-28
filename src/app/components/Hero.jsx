'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Parallax } from 'react-parallax';
import styled from 'styled-components';
import { motion, useAnimation, useTransform, useScroll } from 'framer-motion';
import Confetti from 'react-confetti';

const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

const ColorOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(255, 213, 79, 0.2) 0%, 
    rgba(255, 152, 0, 0.2) 50%,
    rgba(76, 175, 80, 0.1) 100%);
  z-index: 2;
`;

const ParticleCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  opacity: 0.6;
  pointer-events: none;
`;

const GeometricOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  pointer-events: none;
`;

const Decoration = styled(motion.div)`
  position: absolute;
  opacity: ${props => props.opacity || 0.6};
  z-index: 0;
`;

const GeometricElement = styled(Decoration)`
  position: absolute;
  background: ${props => props.bg || 'rgba(255, 213, 79, 0.4)'};
  width: ${props => props.size || '100px'};
  height: ${props => props.size || '100px'};
  border-radius: ${props => props.borderRadius || '0'};
  transform: rotate(${props => props.rotate || '0deg'});
  filter: ${props => props.filter || 'none'};
  mix-blend-mode: ${props => props.blendMode || 'normal'};
`;

const HeroContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.text};
  text-align: center;
  position: relative;
  z-index: 5;
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 2;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.7) inset;
  max-width: 900px;
  margin: 0 1rem;
  overflow: hidden;
  isolation: isolate; /* Creates a new stacking context */
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      ${props => props.theme.colors.primary},
      ${props => props.theme.colors.secondary},
      ${props => props.theme.colors.accent1},
      ${props => props.theme.colors.accent2});
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    margin: 0 0.5rem;
  }
`;

// 3D Avatar Container - positioned to the right side
const AvatarWrapper = styled(motion.div)`
  position: relative;
  width: 300px;
  height: 400px;
  margin-right: 5%;
  z-index: 10;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 1200px) {
    margin: 2rem auto;
    width: 250px;
    height: 350px;
  }
  
  @media (max-width: 768px) {
    width: 200px;
    height: 300px;
  }
`;

// Content and Avatar Layout
const HeroLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  gap: 2rem;
  
  @media (max-width: 1200px) {
    flex-direction: column-reverse;
    justify-content: center;
    padding-top: 2rem;
    padding-bottom: 2rem;
    gap: 1rem;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    height: auto;
    min-height: 100%;
  }
`;

// Adjust the content container width for desktop layout
const TextContent = styled.div`
  max-width: 600px;
  
  @media (max-width: 1200px) {
    max-width: 100%;
    text-align: center;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 768px) {
    margin-top: 1rem;
  }
`;

// Animated grid background
const GridBackground = styled.div`
  position: absolute;
  inset: 0;
  background-size: 40px 40px;
  background-image: 
    linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  z-index: -1;
  transform-origin: center;
  animation: gridPulse 15s infinite linear;
  
  @keyframes gridPulse {
    0% {
      transform: scale(1);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.5;
    }
    100% {
      transform: scale(1);
      opacity: 0.3;
    }
  }
`;

const CircuitLines = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  opacity: 0.07;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: ${props => props.theme.colors.accent1};
  }
  
  &::before {
    top: 20%;
    left: -10%;
    width: 120%;
    height: 1px;
    transform-origin: left center;
    animation: lineScan 8s infinite ease-in-out;
  }
  
  &::after {
    top: -10%;
    left: 70%;
    width: 1px;
    height: 120%;
    transform-origin: top center;
    animation: lineScan 10s infinite ease-in-out 2s;
  }
  
  @keyframes lineScan {
    0% {
      transform: scaleX(0) scaleY(1);
      opacity: 0;
    }
    5% {
      transform: scaleX(1) scaleY(1);
      opacity: 1;
    }
    10% {
      transform: scaleX(1) scaleY(1);
      opacity: 0;
    }
    100% {
      transform: scaleX(1) scaleY(1);
      opacity: 0;
    }
  }
`;

const Title = styled(motion.h1)`
  font-family: var(--font-poppins), sans-serif;
  font-size: clamp(3rem, 8vw, 4.2rem);
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
  font-weight: 700;
  letter-spacing: -0.5px;
  line-height: 1.1;
  position: relative;
  text-shadow: 0 2px 10px rgba(255, 255, 255, 0.3);
  
  span {
    display: block;
    background: linear-gradient(45deg, 
      ${props => props.theme.colors.primary},
      ${props => props.theme.colors.secondary},
      ${props => props.theme.colors.accent1});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 300% 300%;
    animation: shimmerText 8s ease infinite;
  }
  
  @keyframes shimmerText {
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

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-family: var(--font-nunito), sans-serif;
  font-size: clamp(1.2rem, 3vw, 1.4rem);
  max-width: 700px;
  line-height: 1.7;
  margin-bottom: 2.5rem;
  color: ${props => props.theme.colors.text};
  font-weight: 400;
  
  strong {
    font-weight: 600;
    color: ${props => props.theme.colors.accent1};
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const DateDisplay = styled(motion.div)`
  position: relative;
  font-family: var(--font-poppins), sans-serif;
  font-size: 1.4rem;
  padding: 0.8rem 1.5rem;
  margin-bottom: 1.8rem;
  color: white;
  font-weight: 600;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primary}, 
    ${props => props.theme.colors.secondary});
  border-radius: 6px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  
  svg {
    width: 18px;
    height: 18px;
    vertical-align: middle;
    margin-right: 8px;
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
  }
`;

const ScrollButton = styled(motion.button)`
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg,
    ${props => props.theme.colors.accent1},
    ${props => props.theme.colors.accent2});
  border: none;
  color: white;
  padding: 1rem 2.2rem;
  font-size: 1.1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 2rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%);
    z-index: -1;
    transition: all 0.6s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

// Add this new styled component for the emoji animation
const EmojiAnimationContainer = styled(motion.div)`
  position: relative;
  width: 500px;
  height: 550px;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 1400px) {
    width: 450px;
    height: 500px;
  }
  
  @media (max-width: 1200px) {
    margin: 0 auto 1rem;
    width: 90%;
    max-width: 500px;
    height: 400px;
  }
  
  @media (max-width: 768px) {
    height: 350px;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    height: 300px;
  }
`;

const FloatingEmoji = styled(motion.div)`
  position: absolute;
  font-size: ${props => props.size || '3rem'};
  user-select: none;
  filter: drop-shadow(0 0 8px rgba(255,255,255,0.7));
  
  @media (max-width: 1200px) {
    font-size: ${props => props.tabletSize || props.size || '2.5rem'};
  }
  
  @media (max-width: 768px) {
    font-size: ${props => props.mobileSize || props.tabletSize || props.size || '2rem'};
  }
`;

const CakeContainer = styled(motion.div)`
  position: relative;
  font-size: 7rem;
  z-index: 5;
  filter: drop-shadow(0 0 15px rgba(255,215,100,0.8));
  
  @media (max-width: 1200px) {
    font-size: 6rem;
  }
  
  @media (max-width: 768px) {
    font-size: 5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 4.5rem;
  }
`;

// Dynamic particle system animation
function initParticles(canvas) {
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const particles = [];
  const particleCount = 100;
  
  // Resize canvas to match window
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Create particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.color = [
        'rgba(255, 213, 79, 0.3)',
        'rgba(255, 152, 0, 0.3)',
        'rgba(76, 175, 80, 0.3)',
        'rgba(33, 150, 243, 0.3)',
      ][Math.floor(Math.random() * 4)];
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Boundary check
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  // Animate particles
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
      // Connect particles with lines
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 215, 100, ${0.1 - distance/1000})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  return () => {
    window.removeEventListener('resize', resizeCanvas);
  };
}

const Hero = ({ girlfriendName = "Emma", birthDate = "1995-04-15" }) => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [age, setAge] = useState(null);
  const particleCanvasRef = useRef(null);
  const { scrollY } = useScroll();
  const contentControls = useAnimation();
  const avatarControls = useAnimation();
  
  // Parallax effect on scroll
  const yContentTitle = useTransform(scrollY, [0, 300], [0, -50]);
  const opacityContent = useTransform(scrollY, [0, 300], [1, 0]);
  const scaleContent = useTransform(scrollY, [0, 300], [1, 0.9]);
  
  // Add this for the emoji animation
  const emojis = ['🎂', '🎁', '🎈', '🎊', '🥂', '✨', '💝', '💖', '🎉', '🍰'];
  const [animationComplete, setAnimationComplete] = useState(false);
  
  useEffect(() => {
    if (particleCanvasRef.current) {
      const cleanup = initParticles(particleCanvasRef.current);
      return cleanup;
    }
  }, []);
  
  useEffect(() => {
    // Calculate age
    const today = new Date();
    const birth = new Date(birthDate);
    let calculatedAge = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      calculatedAge--;
    }
    setAge(calculatedAge);
    
    // Set window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    // Start content animation
    contentControls.start({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    });
    
    // Start avatar animation
    avatarControls.start({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut"
      }
    });
    
    // Show confetti
    setShowConfetti(true);
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    // Stop confetti after 8 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 8000);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [birthDate, contentControls, avatarControls]);
  
  const scrollToGallery = () => {
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <HeroSection>
      <Parallax
        blur={{ min: -5, max: 15 }}
        bgImage=""
        bgImageAlt="Magnifique arrière-plan"
        strength={200}
        style={{ height: '100%' }}
      >
        <ColorOverlay />
        <ParticleCanvas ref={particleCanvasRef} />
        
        <GeometricOverlay>
          {/* Animated geometric elements */}
          <GeometricElement 
            bg="rgba(255, 213, 79, 0.3)"
            size="300px"
            borderRadius="50%"
            style={{ top: '-100px', right: '-100px' }}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.4, 0.3]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <GeometricElement 
            bg="rgba(76, 175, 80, 0.2)"
            size="300px"
            style={{ 
              bottom: '-100px', 
              left: '-100px',
              clipPath: 'polygon(0% 100%, 100% 100%, 50% 0%)'
            }}
            animate={{ 
              rotate: ['0deg', '5deg', '0deg'],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <GeometricElement 
            bg="rgba(33, 150, 243, 0.15)"
            size="150px"
            style={{ 
              top: '20%', 
              right: '10%',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
            }}
            animate={{ 
              rotate: ['0deg', '15deg', '0deg'],
              opacity: [0.15, 0.2, 0.15]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <GeometricElement 
            bg="rgba(233, 30, 99, 0.1)"
            size="100px"
            style={{ 
              bottom: '25%', 
              left: '15%',
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
            }}
            animate={{ 
              rotate: ['0deg', '-10deg', '0deg'],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </GeometricOverlay>
        
        <HeroContainer>
          {showConfetti && windowSize.width > 0 && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={400}
              colors={['#FFD54F', '#FF9800', '#4CAF50', '#2196F3', '#E91E63']}
            />
          )}
          
          <HeroLayout>
            <TextContent>
              <ContentWrapper
                style={{ y: yContentTitle, opacity: opacityContent, scale: scaleContent }}
                initial={{ opacity: 0, y: 30 }}
                animate={contentControls}
              >
                <GridBackground />
                <CircuitLines />
                
                {age !== null && (
                  <DateDisplay
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Joyeux 26 ans !
                  </DateDisplay>
                )}
                
                <Title
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <span>Joyeux anniversaire</span>
                  Bébé
                </Title>
                
                <Subtitle
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                >
                  Aujourd'hui, nous célébrons la <strong>personne la plus extraordinaire</strong> de ma vie. Merci de remplir chaque jour de joie. Voici notre histoire ensemble...
                </Subtitle>
                
                <ScrollButton
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                  onClick={scrollToGallery}
                >
                  Découvrir Nos Souvenirs
                </ScrollButton>
              </ContentWrapper>
            </TextContent>
            
            {/* Add the emoji animation container to the right */}
            <EmojiAnimationContainer
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              {/* Central birthday cake with glow effect */}
              <CakeContainer
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ 
                  scale: [0.5, 1.2, 1],
                  opacity: 1,
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  delay: 1.5,
                  times: [0, 0.6, 1],
                  onComplete: () => setAnimationComplete(true)
                }}
              >
                🎂
              </CakeContainer>
              
              {/* Floating emojis that appear around the cake */}
              {animationComplete && emojis.map((emoji, index) => (
                <FloatingEmoji
                  key={index}
                  size={`${Math.random() * 2.5 + 2.5}rem`}
                  tabletSize={`${Math.random() * 2 + 2}rem`}
                  mobileSize={`${Math.random() * 1.5 + 1.5}rem`}
                  initial={{ 
                    x: 0,
                    y: 0,
                    opacity: 0
                  }}
                  animate={{ 
                    x: windowSize.width < 768 
                      ? Math.random() * 180 - 90
                      : windowSize.width < 1200
                        ? Math.random() * 250 - 125
                        : Math.random() * 350 - 175,
                    y: windowSize.width < 768 
                      ? Math.random() * 180 - 90
                      : windowSize.width < 1200
                        ? Math.random() * 250 - 125
                        : Math.random() * 350 - 175,
                    opacity: [0, 1, 1, 0],
                    rotate: Math.random() * 360
                  }}
                  transition={{
                    duration: windowSize.width < 768 ? Math.random() * 3 + 2 : Math.random() * 4 + 3,
                    delay: index * 0.2,
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: Math.random() * 2
                  }}
                >
                  {emoji}
                </FloatingEmoji>
              ))}
            </EmojiAnimationContainer>
          </HeroLayout>
        </HeroContainer>
      </Parallax>
    </HeroSection>
  );
};

export default Hero;