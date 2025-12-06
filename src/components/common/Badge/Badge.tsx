import React from "react";
import "./Badge.css";
import RoundCancelIcon from "../../../assets/Icons/svg/RoundCancelIcon";

interface BadgeProps {
  label: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  IconComponent?: React.ElementType;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  showCloseButton = false,
  onClose,
  IconComponent,
}) => {
  return (
    <div className="badge">
      {IconComponent && (
        <div className="badge-icon-wrapper">
          <IconComponent />
        </div>
      )}
      <span className="badge-label">{label}</span>
      {showCloseButton && (
        <div className="badge-close-icon" onClick={onClose}>
          <RoundCancelIcon />
        </div>
      )}
    </div>
  );
};

export default Badge;
