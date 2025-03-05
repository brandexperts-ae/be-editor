import React from 'react';
import LogoSVG from '../../assets/logo.svg';

interface LogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const Logo=({ 
  className = '', 
  style = {} 
}: LogoProps) =>{
  return (
    <img
      src={LogoSVG}
      alt="Logo"
      width={110}
      height="auto" // Maintain aspect ratio
      className={`object-contain ${className}`}
      style={{
        maxWidth: '100%',
        ...style
      }}
    />
  );
}

export default Logo;