import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  textColor?: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'medium',
  backgroundColor = '#5B9FFF',
  textColor = '#FFFFFF',
  className,
}) => {
  const getInitials = (fullName: string): string => {
    if (!fullName) return 'U';
    
    return fullName
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const sizeConfig = {
    small: {
      width: 40,
      height: 40,
      fontSize: 14,
    },
    medium: {
      width: 64,
      height: 64,
      fontSize: 20,
    },
    large: {
      width: 120,
      height: 120,
      fontSize: 40,
    },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={`flex items-center justify-center rounded-full font-bold select-none shrink-0 border-2 border-white/10 ${className}`}
      style={{
        width: `${config.width}px`,
        height: `${config.height}px`,
        backgroundColor: backgroundColor,
        color: textColor,
        fontSize: `${config.fontSize}px`,
      }}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
