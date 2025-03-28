'use client';

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, ArrowRight, Calendar, MapPin, X } from 'react-feather';

const GalleryContainer = styled.section`
  padding: 8rem 2rem;
  background: ${props => props.theme.colors.background};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 10px;
    background: linear-gradient(90deg, 
      ${props => props.theme.colors.primary},
      ${props => props.theme.colors.secondary},
      ${props => props.theme.colors.accent1},
      ${props => props.theme.colors.accent2},
      ${props => props.theme.colors.accent3});
  }
`;

const GeometricPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.4;
  pointer-events: none;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
  }
  
  &::before {
    top: 100px;
    right: -150px;
    background: radial-gradient(circle, ${props => props.theme.colors.primary} 0%, transparent 70%);
    border-radius: 50%;
  }
  
  &::after {
    bottom: 50px;
    left: -150px;
    background: radial-gradient(circle, ${props => props.theme.colors.accent1} 0%, transparent 70%);
    border-radius: 0% 100% 0% 100%;
  }
`;

const HexagonPattern = styled.div`
  position: absolute;
  right: 5%;
  top: 40%;
  width: 100px;
  height: 100px;
  background: ${props => props.theme.colors.accent2};
  opacity: 0.2;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: floatAnimation 9s ease-in-out infinite alternate;
`;

const TrianglePattern = styled.div`
  position: absolute;
  left: 8%;
  bottom: 20%;
  width: 120px;
  height: 120px;
  background: ${props => props.theme.colors.secondary};
  opacity: 0.2;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  animation: floatAnimation 7s ease-in-out infinite alternate-reverse;
`;

const GalleryHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  z-index: 1;
`;

const GalleryTitle = styled.h2`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, ${props => props.theme.colors.secondary}, ${props => props.theme.colors.primary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 4px;
    background: linear-gradient(to right, ${props => props.theme.colors.secondary}, ${props => props.theme.colors.primary});
    border-radius: 4px;
  }
`;

const GallerySubtitle = styled.p`
  font-size: 1.3rem;
  color: ${props => props.theme.colors.lightText};
  max-width: 700px;
  margin: 2rem auto 0;
  line-height: 1.6;
  
  b {
    color: ${props => props.theme.colors.accent1};
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
`;

const PhotoItem = styled(motion.div)`
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  height: 350px;
  position: relative;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease;
  transform-style: preserve-3d;
  perspective: 1000px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, 
      transparent 0%, 
      transparent 50%, 
      rgba(0,0,0,0.7) 100%);
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
  
  &:nth-child(odd) {
    clip-path: polygon(0 0, 100% 0, 98% 100%, 0% 100%);
  }
  
  &:nth-child(even) {
    clip-path: polygon(2% 0, 100% 0, 100% 100%, 0% 100%);
  }
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
  transform-origin: center;
  
  ${PhotoItem}:hover & {
    transform: scale(1.1);
  }
`;

const PhotoFrame = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 2px dashed white;
  opacity: 0;
  z-index: 2;
  transition: opacity 0.3s ease 0.1s;
  
  ${PhotoItem}:hover & {
    opacity: 0.4;
  }
`;

const PhotoInfo = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem;
  color: white;
  z-index: 2;
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.3s ease;
  
  ${PhotoItem}:hover & {
    transform: translateY(0);
    opacity: 1;
  }
`;

const PhotoCaption = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
`;

const PhotoMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
`;

const PhotoLocation = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  
  svg {
    margin-right: 0.5rem;
    width: 16px;
    height: 16px;
  }
`;

const LikeButton = styled(motion.button)`
  position: absolute;
  top: 15px;
  right: 15px;
  background: ${props => props.liked ? props.theme.colors.accent3 : 'rgba(255, 255, 255, 0.8)'};
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  svg {
    color: ${props => props.liked ? 'white' : props.theme.colors.lightText};
    stroke-width: ${props => props.liked ? 3 : 2};
    transition: all 0.3s ease;
  }
`;

const PhotoOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ExpandedPhotoContainer = styled(motion.div)`
  position: relative;
  max-width: 85%;
  max-height: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    max-width: 95%;
    max-height: 80%;
  }
`;

const ExpandedPhoto = styled(motion.img)`
  max-width: 100%;
  max-height: 70vh;
  border-radius: 16px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
`;

const DetailBox = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  margin-top: 1.5rem;
  width: 100%;
  max-width: 600px;
  color: ${props => props.theme.colors.text};
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, 
      ${props => props.theme.colors.primary},
      ${props => props.theme.colors.secondary},
      ${props => props.theme.colors.accent1},
      ${props => props.theme.colors.accent2});
  }
`;

const DetailCaption = styled.h3`
  margin-bottom: 1.2rem;
  font-size: 2rem;
  text-align: center;
  color: ${props => props.theme.colors.text};
  background: linear-gradient(45deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const DetailDescription = styled.p`
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 1.2rem;
  line-height: 1.7;
  color: ${props => props.theme.colors.lightText};
`;

const DetailMeta = styled.div`
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #eee;
  padding-top: 1.2rem;
  margin-top: 1rem;
`;

const NavButtons = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const NavButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  border: 2px solid white;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const CloseButton = styled(motion.button)`
  position: fixed;
  top: 30px;
  right: 30px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  border: 2px solid white;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 101;
  
  svg {
    width: 24px;
    height: 24px;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const MemoryCount = styled.div`
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  padding: 0.5rem 1.5rem;
  border-radius: 30px;
  font-size: 1.1rem;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;
const StyledPagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 4rem;
  gap: 0.5rem;
`;

const PaginationDot = styled.button.attrs(props => ({
  'data-active': props.active
}))`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props['data-active'] 
    ? `linear-gradient(45deg, ${props.theme.colors.primary}, ${props.theme.colors.secondary})` 
    : '#d1d5db'};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedPhotos, setLikedPhotos] = useState({});
  
  // Remplacer par vos photos et leurs légendes
  const photos = [
    { 
      src: '/photos/photo7.JPG', 
      caption: 'Toute belle', 
      location: 'La grosse Cala', 
      description: '',
      liked: false
    },
    { 
      src: '/photos/photo8.jpg', 
      caption: 'Depuis toujours drôle', 
      location: 'Petit Snap', 
      description: 'Une autre de nos photos les moins flatteuses mais les plus drôles. C\'est ces moments de pure authenticité qui rendent notre relation si spéciale.',
      liked: false
    },
    { 
      src: '/photos/photo1.JPG', 
      caption: 'Notre emménagement à Nantes', 
      location: 'Nantes', 
      description: 'Le début de notre belle aventure ensemble. Notre premier chez nous, nos premiers pas dans cette ville qui allait devenir notre cocon.',
      liked: false
    },
    { 
      src: '/photos/photo2.JPG', 
      caption: 'Notre complicité intemporelle', 
      location: 'Cagnes Sur Mer', 
      description: 'Depuis le début, notre relation est remplie de rires et de joie. Notre amour n\'a fait que grandir au fil du temps, et notre complicité reste intacte.',
      liked: false
    },
    { 
      src: '/photos/photo3.jpg', 
      caption: 'Notre évolution ensemble', 
      location: 'La Corniche des Pugets', 
      description: 'À travers les années, nous avons grandi et changé ensemble. Chaque étape nous a rendus plus forts, plus unis.',
      liked: false
    },
    { 
      src: '/photos/photo4.JPG', 
      caption: 'Ton sourire qui illumine ma vie', 
      location: 'Cagnes Sur Maré', 
      description: 'Ta personnalité solaire et ton rire contagieux ont toujours été ma source de bonheur. Tu as ce don de rendre chaque moment spécial.',
      liked: false
    },
    { 
      src: '/photos/photo5.JPG', 
      caption: 'Nos moments de simplicité', 
      location: 'Fréjus', 
      description: 'Ces instants où on se fiche d\'être moches, où on est juste nous-mêmes. C\'est dans ces moments-là que je t\'aime le plus.',
      liked: false
    },
    { 
      src: '/photos/photo6.JPG', 
      caption: 'Nos souvenirs', 
      location: 'La Mala', 
      description: 'Chaque photo, chaque moment passé ensemble raconte notre histoire. Une collection de souvenirs précieux qui continue de s\'enrichir chaque jour.',
      liked: false
    }
  ];

  const handlePhotoClick = (photo, index) => {
    setSelectedImg(photo);
    setCurrentIndex(index);
  };

  const handleLike = (e, photoId) => {
    e.stopPropagation();
    setLikedPhotos({
      ...likedPhotos,
      [photoId]: !likedPhotos[photoId]
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
    setSelectedImg(photos[currentIndex === photos.length - 1 ? 0 : currentIndex + 1]);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
    setSelectedImg(photos[currentIndex === 0 ? photos.length - 1 : currentIndex - 1]);
  };

  return (
    <GalleryContainer id="gallery">
      <GeometricPattern />
      <HexagonPattern />
      <TrianglePattern />
      
      <GalleryHeader>
        <GalleryTitle>Nos Souvenirs Colorés</GalleryTitle>
        <GallerySubtitle>
          Chaque photo capture un moment dans notre aventure. 
          Clique sur n'importe quelle photo pour revivre nos <b>aventures spéciales</b> ensemble.
        </GallerySubtitle>
      </GalleryHeader>
      
      <PhotoGrid>
        {photos.map((photo, index) => (
          <PhotoItem 
            key={index}
            whileHover={{ 
              y: -10,
              transition: { duration: 0.3 }
            }}
            onClick={() => handlePhotoClick(photo, index)}
          >
            <Photo src={photo.src} alt={photo.caption} />
            <PhotoFrame />
            <PhotoInfo>
              <PhotoCaption>{photo.caption}</PhotoCaption>
              <PhotoMeta>
                <PhotoLocation>
                  <MapPin size={16} />
                  {photo.location}
                </PhotoLocation>
              </PhotoMeta>
            </PhotoInfo>
            <LikeButton 
              liked={likedPhotos[index]}
              onClick={(e) => handleLike(e, index)}
              whileTap={{ scale: 0.9 }}
            >
              <Heart fill={likedPhotos[index] ? "currentColor" : "none"} />
            </LikeButton>
          </PhotoItem>
        ))}
      </PhotoGrid>
      
      <StyledPagination>
        {[...Array(Math.ceil(photos.length / 6))].map((_, i) => (
          <PaginationDot key={i} active={i === 0} />
        ))}
      </StyledPagination>
      
      <AnimatePresence>
        {selectedImg && (
          <>
            <PhotoOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MemoryCount>
                {currentIndex + 1} of {photos.length}
              </MemoryCount>
              
              <ExpandedPhotoContainer
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <ExpandedPhoto 
                  src={selectedImg.src} 
                  alt={selectedImg.caption}
                  initial={{ y: -50 }}
                  animate={{ y: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                />
                
                <DetailBox
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <DetailCaption>{selectedImg.caption}</DetailCaption>
                  <DetailDescription>{selectedImg.description}</DetailDescription>
                  <DetailMeta>
                    <PhotoLocation>
                      <MapPin size={16} />
                      {selectedImg.location}
                    </PhotoLocation>
                  </DetailMeta>
                </DetailBox>
                
                <NavButtons>
                  <NavButton
                    onClick={handlePrev}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ArrowLeft />
                  </NavButton>
                  
                  <NavButton
                    onClick={handleNext}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ArrowRight />
                  </NavButton>
                </NavButtons>
              </ExpandedPhotoContainer>
              
              <CloseButton
                onClick={() => setSelectedImg(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X />
              </CloseButton>
            </PhotoOverlay>
          </>
        )}
      </AnimatePresence>
    </GalleryContainer>
  );
};

export default Gallery;