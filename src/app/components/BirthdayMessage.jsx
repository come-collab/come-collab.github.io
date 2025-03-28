'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const MessageContainer = styled.section`
  padding: 8rem 2rem;
  background: linear-gradient(135deg, #fff6e5 0%, #ffe8f0 100%);
  color: ${props => props.theme.colors.text};
  position: relative;
  overflow: hidden;
`;

const BackgroundShapes = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

const SunShape = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 213, 79, 0.2) 0%, rgba(255, 213, 79, 0) 70%);
  top: -200px;
  right: -200px;
  opacity: 0.8;
`;

const WavePattern = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 150px;
  background: linear-gradient(45deg, 
    ${props => props.theme.colors.primary}, 
    ${props => props.theme.colors.secondary}, 
    ${props => props.theme.colors.accent1}, 
    ${props => props.theme.colors.accent2});
  opacity: 0.1;
  clip-path: polygon(
    0% 100%,
    100% 100%,
    100% 40%,
    95% 45%,
    90% 40%,
    85% 45%,
    80% 40%,
    75% 45%,
    70% 40%,
    65% 45%,
    60% 40%,
    55% 45%,
    50% 40%,
    45% 45%,
    40% 40%,
    35% 45%,
    30% 40%,
    25% 45%,
    20% 40%,
    15% 45%,
    10% 40%,
    5% 45%,
    0% 40%
  );
`;

const Decoration = styled(motion.div)`
  position: absolute;
  background: ${props => props.color || props.theme.colors.primary};
  opacity: ${props => props.opacity || 0.15};
  z-index: 0;
  border-radius: ${props => props.borderRadius || '0'};
  filter: blur(${props => props.blur || '0'});
`;

const Circle1 = styled(Decoration)`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  top: 15%;
  left: 10%;
  background: radial-gradient(circle, rgba(76, 175, 80, 0.3) 0%, rgba(76, 175, 80, 0) 70%);
`;

const Circle2 = styled(Decoration)`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  bottom: 20%;
  right: 15%;
  background: radial-gradient(circle, rgba(33, 150, 243, 0.25) 0%, rgba(33, 150, 243, 0) 70%);
`;

const Polygon = styled(Decoration)`
  width: 120px;
  height: 120px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  bottom: 30%;
  left: 20%;
  background: ${props => props.theme.colors.accent2};
`;

const FloatingItem = styled(motion.div)`
  position: absolute;
  font-size: ${props => props.size}px;
  pointer-events: none;
  z-index: 1;
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.1));
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  text-align: center;
`;

const MessageTitle = styled(motion.h2)`
  font-size: 3.5rem;
  margin-bottom: 3rem;
  line-height: 1.3;
  background: linear-gradient(45deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;
  font-family: ${props => props.theme.fonts.heading};
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 4px;
    background: linear-gradient(to right, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const MessageBox = styled(motion.div)`
  background: #ffffff;
  border-radius: 24px;
  padding: 0;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
  color: ${props => props.theme.colors.text};
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const MessageHeader = styled.div`
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  
  &::before {
    content: "💌";
    position: absolute;
    left: 2rem;
    font-size: 1.8rem;
  }
  
  h3 {
    font-size: 1.8rem;
    margin: 0;
    font-weight: 600;
  }
`;

const MessageContent = styled.div`
  font-size: 1.3rem;
  line-height: 1.8;
  position: relative;
  z-index: 1;
  text-align: left;
  padding: 3rem;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23f5f5f5' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E");
  
  p {
    margin-bottom: 1.5rem;
    position: relative;
    
    &:first-of-type {
      font-family: ${props => props.theme.fonts.heading};
      color: ${props => props.theme.colors.accent3};
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 2rem;
    }
  }
  
  .highlight {
    background: linear-gradient(45deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 2rem;
  }
`;

const QuoteMarks = styled.div`
  position: relative;
  
  &::before, &::after {
    font-family: serif;
    position: absolute;
    font-size: 6rem;
    opacity: 0.1;
    color: ${props => props.theme.colors.primary};
  }
  
  &::before {
    content: '"';
    top: -20px;
    left: 0;
  }
  
  &::after {
    content: '"';
    bottom: -80px;
    right: 20px;
  }
`;

const Signature = styled.div`
  font-family: ${props => props.theme.fonts.accent};
  font-size: 2.5rem;
  margin-top: 2rem;
  background: linear-gradient(45deg, ${props => props.theme.colors.secondary}, ${props => props.theme.colors.primary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: right;
  padding-right: 2rem;
`;

const ButtonContainer = styled.div`
  margin-top: 4rem;
  display: flex;
  justify-content: center;
`;

const ReadMessageButton = styled(motion.button)`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  border: none;
  padding: 1.2rem 3.5rem;
  font-size: 1.3rem;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(255, 213, 79, 0.3);
  font-weight: 600;
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 100%;
    background: linear-gradient(135deg, ${props => props.theme.colors.secondary}, ${props => props.theme.colors.primary});
    transition: all 0.5s ease;
    z-index: -1;
  }
  
  &:hover {
    box-shadow: 0 15px 30px rgba(255, 213, 79, 0.5);
    
    &::before {
      width: 100%;
    }
  }
`;

const TypewriterText = styled.div`
  min-height: 400px;
`;

// Custom typewriter effect component with improved timing
const CustomTypewriter = ({ text, speed = 30, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const paragraphs = text.split('</p><p>');
  
  useEffect(() => {
    if (currentIndex >= text.length) {
      onComplete && onComplete();
      return;
    }
    
    const timer = setTimeout(() => {
      setDisplayedText(text.substring(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
      
      // Add slight pause after punctuation
      const currentChar = text[currentIndex];
      if (['.', '!', '?', ','].includes(currentChar)) {
        return setTimeout(() => {}, speed * 3);
      }
    }, speed);
    
    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, onComplete]);
  
  // Convert text with HTML tags to React elements
  const renderText = () => {
    if (!displayedText.includes('<p>')) return displayedText;
    
    return displayedText
      .replace('<p>', '')
      .split('</p><p>')
      .map((paragraph, index) => {
        // Handle the last paragraph which might not be complete
        if (index === paragraphs.length - 1) {
          return <p key={index} dangerouslySetInnerHTML={{__html: paragraph.replace('</p>', '')}} />;
        }
        return <p key={index} dangerouslySetInnerHTML={{__html: paragraph}} />;
      });
  };
  
  return <div>{renderText()}</div>;
};

const BirthdayMessage = ({ girlfriendName = "Emma", yourName = "John" }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [items, setItems] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  
  const fullMessage = `<p>Ma beauté parfaite,</p><p>Aujourd'hui,
   alors que tu célèbres une autre année de ta <span class="highlight">belle vie</span>, 
   j'en profite pour te dire à quel point vivre avec toi m'apporte de la joie et du bonnheur. 
     Tu m'inspires à être une meilleure personne par ta gentillesse, ta force, ton intelligence et par ta maniere de réfléchir.
     </p><p>En ce jour spécial, je veux que tu saches que j'aime chaque moment que nous passons ensemble –
      de nos aventures à nos soirées tranquilles à la maison.
      </p><p>Je te promets de continuer à t'aimer, à te faire rire et à être ton partenaire dans de la vie (mais donne moi 12 bizoz).
       Tu ne mérites que du <span class="highlight">bonheur</span>, et je ferai tout ce que je peux pour t'en apporter chaque jour.
       </p><p>Joyeux anniversaire, mon amour.</p>`;

  // Generate floating items with varied positions
  useEffect(() => {
    const emojis = ['🎂', '🎁', '🎈', '✨', '🎊', '🥳', '🎉', '❤️', '🌸', '🌺'];
    
    // Generate a good spread of items across the container
    const initialItems = Array.from({ length: 20 }, (_, i) => {
      // Create a more varied distribution
      const quadrant = i % 4; // Divide into 4 quadrants
      
      let xBase, yBase;
      
      // Assign base positions by quadrant to ensure spread
      switch(quadrant) {
        case 0: // Top-left
          xBase = 0; 
          yBase = 0;
          break;
        case 1: // Top-right
          xBase = 50;
          yBase = 0;
          break;
        case 2: // Bottom-left
          xBase = 0;
          yBase = 50;
          break;
        case 3: // Bottom-right
          xBase = 50;
          yBase = 50;
          break;
      }
      
      // Add randomness within the quadrant
      const xOffset = (i * 7) % 45;
      const yOffset = (i * 11) % 45;
      
      return {
        id: i,
        x: xBase + xOffset,
        y: yBase + yOffset,
        emoji: emojis[i % emojis.length],
        size: 24 + (i % 16),
        delay: (i * 0.3) % 5,
        duration: 10 + (i % 15)
      };
    });
    
    setItems(initialItems);
  }, []);
  
  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setMessageVisible(true);
    }, 500);
  };

  return (
    <MessageContainer id="message">
      <BackgroundShapes>
        <SunShape />
        <WavePattern />
        <Circle1 
          animate={{ 
            y: [0, -15, 0], 
            opacity: [0.2, 0.3, 0.2] 
          }} 
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }} 
        />
        <Circle2 
          animate={{ 
            y: [0, 15, 0], 
            opacity: [0.25, 0.15, 0.25] 
          }} 
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }} 
        />
        <Polygon 
          animate={{ 
            rotate: [0, 10, 0], 
            opacity: [0.15, 0.2, 0.15] 
          }} 
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }} 
        />
      </BackgroundShapes>
      
      {items.map(item => (
        <FloatingItem
          key={item.id}
          size={item.size}
          initial={{ 
            x: `${item.x}%`, 
            y: `${item.y}%`, 
            opacity: 0,
            scale: 0 
          }}
          animate={{ 
            y: [`${item.y}%`, `${item.y - 15}%`, `${item.y}%`],
            x: [`${item.x}%`, `${item.x + 5}%`, `${item.x}%`],
            rotate: [0, 180, 360],
            scale: [0, 1, 0],
            opacity: [0, 0.9, 0]
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            repeatDelay: item.delay * 0.5
          }}
        >
          {item.emoji}
        </FloatingItem>
      ))}
      
      <ContentWrapper>
        <MessageTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Un Message d'Anniversaire Spécial Pour Toi
        </MessageTitle>
        
        <AnimatePresence mode="wait">
          {!showMessage ? (
            <ButtonContainer>
              <ReadMessageButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShowMessage}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                Lire Mon Message ✨
              </ReadMessageButton>
            </ButtonContainer>
          ) : (
            <MessageBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
            >
              <MessageHeader>
                <h3>Une Lettre pour toi</h3>
              </MessageHeader>
              
              <MessageContent>
                <QuoteMarks>
                  {messageVisible && (
                    <>
                      {!completed ? (
                        <TypewriterText>
                          <CustomTypewriter 
                            text={fullMessage}
                            speed={30}
                            onComplete={() => setCompleted(true)}
                          />
                        </TypewriterText>
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: fullMessage }} />
                      )}
                      <Signature>Côme ton bgetto</Signature>
                    </>
                  )}
                </QuoteMarks>
              </MessageContent>
            </MessageBox>
          )}
        </AnimatePresence>
      </ContentWrapper>
    </MessageContainer>
  );
};

export default BirthdayMessage;