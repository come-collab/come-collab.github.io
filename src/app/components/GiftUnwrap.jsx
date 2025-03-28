import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

const GiftContainer = styled.div`
  padding: 8rem 2rem;
  background-color: #fff0f6;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const GiftTitle = styled(motion.h2)`
  font-size: 3rem;
  margin-bottom: 2.5rem;
  background: linear-gradient(45deg, #ff79c6, #bd93f9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(to right, #ff79c6, #bd93f9);
    border-radius: 3px;
  }
`;

const GiftSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.6;
`;

const GiftWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
`;

const GiftBox = styled(motion.div)`
  width: 300px;
  height: 300px;
  margin: 0 auto;
  position: relative;
  cursor: pointer;
  
  &:hover .lid {
    transform: translateY(-40px) rotateX(10deg);
  }
`;

const GiftBoxOuter = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
`;

const GiftLid = styled.div`
  width: 300px;
  height: 40px;
  position: absolute;
  top: -40px;
  background: linear-gradient(45deg, #ff79c6, #bd93f9);
  transform-origin: bottom;
  transition: transform 0.5s ease;
  transform: translateY(0) rotateX(0);
  z-index: 2;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  &:before, &:after {
    content: '';
    position: absolute;
    background: rgba(255, 255, 255, 0.2);
  }
  
  &:before {
    width: 40px;
    height: 100%;
    left: 130px;
  }
`;

const GiftBase = styled.div`
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #ff79c6, #bd93f9);
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  
  &:before, &:after {
    content: '';
    position: absolute;
    background: rgba(255, 255, 255, 0.2);
  }
  
  &:before {
    width: 40px;
    height: 100%;
    left: 130px;
  }
  
  &:after {
    width: 100%;
    height: 40px;
    top: 130px;
  }
`;

const GiftRibbon = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff5555;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 3;
  
  &:before, &:after {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    background: #ff5555;
  }
  
  &:before {
    top: -15px;
    left: -10px;
    transform: rotate(45deg);
  }
  
  &:after {
    top: -15px;
    right: -10px;
    transform: rotate(-45deg);
  }
`;

const UnwrapButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff79c6, #bd93f9);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 50px;
  margin-top: 3rem;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
  }
`;

const GiftContent = styled(motion.div)`
  max-width: 600px;
  margin: 4rem auto 0;
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 4;
`;

const GiftMessage = styled.div`
  font-size: 1.3rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 2rem;
  
  p {
    margin-bottom: 1.5rem;
  }
`;

const GiftImage = styled.img`
  max-width: 100%;
  border-radius: 10px;
  margin: 2rem 0;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const GiftReveal = styled(motion.div)`
  margin-top: 4rem;
`;

const SurpriseText = styled(motion.h3)`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #ff79c6;
`;

const GiftUnwrap = ({ surpriseGift = "Billets de Concert", girlfriendName = "Emma" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleUnwrap = () => {
    setIsOpen(true);
    setShowConfetti(true);
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 8000);
  };
  
  return (
    <GiftContainer id="gift">
      <GiftTitle
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Une Dernière Surprise Pour Toi
      </GiftTitle>
      
      <GiftSubtitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Parce que tu mérites d'être gâtée pour ton jour spécial.
        Clique sur le bouton pour révéler ton cadeau...
      </GiftSubtitle>
      
      <GiftWrapper>
        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
            colors={['#ff79c6', '#bd93f9', '#ff5555', '#f1fa8c', '#50fa7b']}
          />
        )}
        
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.6 }}
            >
              <GiftBox>
                <GiftBoxOuter>
                  <GiftLid className="lid" />
                  <GiftBase />
                  <GiftRibbon />
                </GiftBoxOuter>
              </GiftBox>
              
              <UnwrapButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUnwrap}
              >
                Ouvrir Ton Cadeau
              </UnwrapButton>
            </motion.div>
          ) : (
            <GiftContent
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.5,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              <SurpriseText
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Surprise ! 🎉
              </SurpriseText>
              
              <GiftMessage>
                <p>Ma chère {girlfriendName},</p>
                
                <p>
                  Pour ton anniversaire cette année, je voulais t'offrir quelque chose 
                  de spécial que nous puissions vivre ensemble et créer encore plus 
                  de beaux souvenirs.
                </p>
                
                <GiftReveal
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                >
                  <p>
                    <strong>Je suis ravi de te surprendre avec :</strong>
                  </p>
                  
                  <SurpriseText
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      delay: 2,
                      type: "spring",
                      stiffness: 500
                    }}
                  >
                    {surpriseGift}
                  </SurpriseText>
                  
                  <GiftImage src="/path-to-gift-image.jpg" alt={surpriseGift} />
                  
                  <p>
                    J'espère que cela rendra ton anniversaire encore plus spécial.
                    J'ai hâte de profiter de cette expérience avec toi !
                  </p>
                  
                  <p>
                    Tout mon amour, pour toujours et à jamais.
                  </p>
                </GiftReveal>
              </GiftMessage>
            </GiftContent>
          )}
        </AnimatePresence>
      </GiftWrapper>
    </GiftContainer>
  );
};

export default GiftUnwrap;