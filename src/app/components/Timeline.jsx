'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Calendar, MapPin, Heart, Star, Sun } from 'react-feather';

const TimelineContainer = styled.section`
  padding: 8rem 2rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.backgroundAlt} 0%, ${props => props.theme.colors.background} 100%);
  position: relative;
  overflow: hidden;
`;

const BackgroundElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const ColorfulBackdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(255, 105, 180, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 75% 40%, rgba(255, 223, 0, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(0, 191, 255, 0.15) 0%, transparent 50%);
  opacity: 0.7;
`;

const Circle = styled(motion.div)`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 152, 0, 0.25) 0%, rgba(255, 152, 0, 0) 70%);
  right: -100px;
  top: 20%;
  filter: blur(3px);
`;

const Triangle = styled(motion.div)`
  position: absolute;
  width: 200px;
  height: 200px;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  background: radial-gradient(circle, rgba(76, 175, 80, 0.25) 0%, rgba(76, 175, 80, 0) 70%);
  left: -50px;
  bottom: 15%;
  transform: rotate(-20deg);
  filter: blur(2px);
`;

const Hexagon = styled(motion.div)`
  position: absolute;
  width: 150px;
  height: 150px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  background: radial-gradient(circle, rgba(33, 150, 243, 0.25) 0%, rgba(33, 150, 243, 0) 70%);
  right: 10%;
  bottom: 30%;
  filter: blur(2px);
`;

const FloatingHeart = styled(motion.div)`
  position: absolute;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, rgba(255, 105, 180, 0.35) 0%, rgba(255, 105, 180, 0) 70%);
  clip-path: path("M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z");
  transform: scale(1.5);
  filter: blur(1px);
`;

const StarShape = styled(motion.div)`
  position: absolute;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.35) 0%, rgba(255, 215, 0, 0) 70%);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  filter: blur(1px);
`;

const Dot = styled(motion.div)`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.color || 'rgba(255, 255, 255, 0.5)'};
  filter: blur(${props => props.blur || '1px'});
`;

const ShootingStar = styled(motion.div)`
  position: absolute;
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  transform-origin: 100% 0%;
`;

const Sparkle = styled(motion.div)`
  position: absolute;
  width: ${props => props.size || '15px'};
  height: ${props => props.size || '15px'};
  background-image: radial-gradient(circle, ${props => props.color || 'white'} 0%, transparent 70%);
  border-radius: 50%;
`;

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(76, 175, 80, 0.1) 50%, rgba(33, 150, 243, 0.1) 100%);
  mix-blend-mode: overlay;
`;

const TimelineTitle = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
  font-size: 3.5rem;
  background: linear-gradient(45deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;
  text-shadow: 0 0 20px rgba(255, 152, 0, 0.3);
  
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
    box-shadow: 0 0 15px rgba(255, 152, 0, 0.5);
  }
`;

const TimelineHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 5rem;
  position: relative;
  z-index: 1;
`;

const TimelineSubtitle = styled.p`
  font-size: 1.3rem;
  color: ${props => props.theme.colors.lightText};
  line-height: 1.6;
  margin-top: 2rem;
  
  span {
    color: ${props => props.theme.colors.accent1};
    font-weight: 600;
  }
`;

const TimelineWrapper = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 100%;
    background: linear-gradient(to bottom, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary}, ${props => props.theme.colors.accent1});
    border-radius: 3px;
    
    @media (max-width: 768px) {
      left: 30px;
    }
  }
`;

const TimelineEvent = styled(motion.div)`
  display: flex;
  position: relative;
  margin-bottom: 100px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-left: 80px;
  }
  
  &:nth-child(odd) {
    justify-content: flex-start;
    
    @media (min-width: 769px) {
      padding-right: calc(50% + 40px);
    }
    
    .timeline-dot {
      @media (min-width: 769px) {
        right: -44px;
      }
    }
  }
  
  &:nth-child(even) {
    justify-content: flex-end;
    
    @media (min-width: 769px) {
      padding-left: calc(50% + 40px);
    }
    
    .timeline-dot {
      @media (min-width: 769px) {
        left: -44px;
      }
    }
  }
`;

const TimelineDot = styled.div`
  position: absolute;
  top: 20px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(45deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  border: 6px solid white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  &::after {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 50%;
    background: linear-gradient(45deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
    opacity: 0.3;
    animation: pulse 2s infinite;
    z-index: -1;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(0.95);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.3;
    }
    100% {
      transform: scale(0.95);
      opacity: 0.7;
    }
  }
  
  @media (max-width: 768px) {
    left: 17px;
  }
`;

const TimelineContent = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: ${props => props.color || props.theme.colors.primary};
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 20px;
    width: 0;
    height: 0;
    border-style: solid;
    
    @media (min-width: 769px) {
      ${props => props.position === 'left' 
        ? 'right: -15px; border-width: 15px 0 15px 15px; border-color: transparent transparent transparent white;' 
        : 'left: -15px; border-width: 15px 15px 15px 0; border-color: transparent white transparent transparent;'
      }
    }
    
    @media (max-width: 768px) {
      left: -15px;
      border-width: 15px 15px 15px 0;
      border-color: transparent white transparent transparent;
    }
  }
  
  .ribbon {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 75px;
    height: 75px;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 150%;
      height: 40px;
      background: ${props => props.color || props.theme.colors.primary};
      transform: rotate(45deg) translateY(-20px);
      opacity: 0.2;
    }
  }
`;

const EventHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const EventDate = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 6px;
  }
`;

const EventLocation = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.lightText};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 6px;
  }
`;

const EventTitle = styled.h3`
  font-size: 1.6rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.3;
  
  background: linear-gradient(45deg, ${props => props.color || props.theme.colors.primary}, ${props => props.color || props.theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const EventDescription = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.lightText};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const EventFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const EventIcon = styled.div`
  margin-left: 1rem;
  color: ${props => props.color || props.theme.colors.secondary};
  
  svg {
    stroke-width: 2;
  }
`;

const HeartIcon = styled(EventIcon)`
  color: ${props => props.theme.colors.accent3};
`;

const Timeline = () => {
  const events = [
    {
      date: "15 juin 2022",
      title: "Quand Nous Nous Sommes Rencontrés",
      description: "Petit date au cimetierre de Saint Lau",
      location: "Cimetierre de Saint Lau",
      color: "#FFD54F"
    },
    {
      date: "30 août 2022",
      title: "Notre Premier Voyage Ensemble",
      description: "Nos fiançailles, un voyage à Copenhague, déjà sur que tu etais ma moitié",
      location: "Copenhague",
      color: "#FF9800"
    },
    {
      date: "14 février 2023",
      title: "Récupération du fils",
      description: "Adoption du Francisco premier du nom pour la modique somme de 0€",
      location: "Nantes",
      color: "#2196F3"
    },
    {
      date: "25 décembre 2022",
      title: "Emmenagement à Nantes",
      description: "Premier appartement ensemble si loin de notre Sud avec toutes les épreuves",
      location: "Nantes",
      color: "#4CAF50"
    },
    {
      date: "Aujourd'hui",
      title: "Une Autre Année à T'Aimer",
      description: "Voici une autre année de création de beaux souvenirs ensemble. Je tombe de plus en plus amoureux de toi chaque jour. Tu rends ma vie tellement plus belles",
      location: "Partout",
      color: "#FFD54F"
    }
  ];

  const getIcon = (index) => {
    const icons = [
      <Calendar size={18} />,
      <Star size={18} />,
      <Sun size={18} />,
      <Heart size={18} />,
      <Star size={18} />,
      <Heart size={18} />
    ];
    return icons[index % icons.length];
  };

  const generateRandomDots = (count) => {
    return Array.from({ length: count }).map((_, i) => {
      const size = 5 + Math.random() * 8;
      const colors = [
        'rgba(255, 152, 0, 0.6)', 
        'rgba(76, 175, 80, 0.6)', 
        'rgba(33, 150, 243, 0.6)',
        'rgba(255, 105, 180, 0.6)',
        'rgba(255, 215, 0, 0.6)'
      ];
      
      return (
        <Dot 
          key={i}
          color={colors[Math.floor(Math.random() * colors.length)]}
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
          }}
          blur={`${Math.random() * 2}px`}
          animate={{ 
            y: [0, -Math.random() * 60 - 20, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.4, 0.8, 0.4] 
          }}
          transition={{ 
            duration: 5 + Math.random() * 15, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
        />
      );
    });
  };

  const generateShootingStars = (count) => {
    return Array.from({ length: count }).map((_, i) => (
      <ShootingStar
        key={i}
        style={{ 
          top: `${Math.random() * 70}%`, 
          left: `${Math.random() * 70}%`,
          rotate: `${Math.random() * 45}deg`,
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ 
          scaleX: [0, 1],
          x: [0, 100],
          opacity: [0, 1, 0]
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: Math.random() * 20 + 10,
          ease: "easeOut"
        }}
      />
    ));
  };

  const generateSparkles = (count) => {
    const sparkleColors = [
      'rgba(255, 215, 0, 0.8)',
      'rgba(255, 255, 255, 0.8)',
      'rgba(135, 206, 235, 0.8)'
    ];
    
    return Array.from({ length: count }).map((_, i) => {
      const size = `${5 + Math.random() * 10}px`;
      return (
        <Sparkle
          key={i}
          size={size}
          color={sparkleColors[Math.floor(Math.random() * sparkleColors.length)]}
          style={{ 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`,
          }}
          animate={{ 
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 90, 180]
          }}
          transition={{ 
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            repeatDelay: Math.random() * 8,
            ease: "easeInOut"
          }}
        />
      );
    });
  };

  return (
    <TimelineContainer id="timeline">
      <BackgroundElements>
        <ColorfulBackdrop />
        
        <Circle 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.9, 0.7] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        
        <Triangle 
          animate={{ 
            rotate: [-20, -15, -20],
            y: [0, -15, 0],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        
        <Hexagon 
          animate={{ 
            rotate: [0, 10, 0],
            scale: [1, 1.05, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        
        {Array.from({ length: 5 }).map((_, i) => (
          <FloatingHeart
            key={`heart-${i}`}
            style={{ 
              left: `${10 + (i * 20)}%`, 
              top: `${10 + (Math.random() * 70)}%`,
              scale: 0.5 + Math.random() * 1.5
            }}
            animate={{ 
              y: [0, -20 - (Math.random() * 30), 0],
              opacity: [0.6, 0.9, 0.6],
              scale: [1, 1.1, 1]
            }}
          transition={{ 
              duration: 5 + (Math.random() * 5), 
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
        
        {Array.from({ length: 5 }).map((_, i) => (
          <StarShape
            key={`star-${i}`}
            style={{ 
              left: `${(i * 20)}%`, 
              top: `${40 + (Math.random() * 50)}%`,
              scale: 0.5 + Math.random()
            }}
            animate={{ 
              rotate: [0, 15 * (Math.random() > 0.5 ? 1 : -1), 0],
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.9, 0.6]
            }}
            transition={{ 
              duration: 6 + (Math.random() * 6), 
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
        
        {generateRandomDots(40)}
        
        {generateShootingStars(5)}
        
        {generateSparkles(30)}
        
        <GradientOverlay />
      </BackgroundElements>
      
      <TimelineHeader>
        <TimelineTitle>Notre Parcours</TimelineTitle>
        <TimelineSubtitle>
          Chaque moment avec toi est précieux. Voici un voyage à travers certaines de nos 
          <span> étapes spéciales</span> ensemble.
        </TimelineSubtitle>
      </TimelineHeader>
      
      <TimelineWrapper>
        {events.map((event, index) => {
          const isEven = index % 2 === 0;
          const position = isEven ? 'left' : 'right';
          
          return (
            <TimelineItem 
              key={index} 
              event={event} 
              position={position}
              index={index}
              icon={getIcon(index)}
            />
          );
        })}
      </TimelineWrapper>
    </TimelineContainer>
  );
};

const TimelineItem = ({ event, position, index, icon }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);
  
  const variants = {
    hidden: { 
      opacity: 0, 
      x: position === 'left' ? -50 : 50,
      y: 20
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        delay: index * 0.2,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <TimelineEvent ref={ref}>
      <TimelineDot className="timeline-dot">
        {icon}
      </TimelineDot>
      <TimelineContent
        position={position}
        color={event.color}
        variants={variants}
        initial="hidden"
        animate={controls}
      >
        <div className="ribbon"></div>
        <EventHeader>
          <EventDate color={event.color}>
            <Calendar size={16} />
            {event.date}
          </EventDate>
          <EventLocation>
            <MapPin size={16} />
            {event.location}
          </EventLocation>
        </EventHeader>
        <EventTitle color={event.color}>{event.title}</EventTitle>
        <EventDescription>{event.description}</EventDescription>
        <EventFooter>
          <EventIcon color={event.color}>
            <Star size={16} />
          </EventIcon>
          <HeartIcon>
            <Heart size={16} />
          </HeartIcon>
        </EventFooter>
      </TimelineContent>
    </TimelineEvent>
  );
};

export default Timeline;