import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SuccessModal.css';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleContinue = () => {
    onClose();
    navigate('/dashboard');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-icon">✅</div>
        <h2 className="modal-title">הפעולה הושלמה בהצלחה!</h2>
        <p className="modal-text">הנתונים נשמרו במערכת.</p>
        <button className="modal-btn" onClick={handleContinue}>
          להמשך - לדף הבית
        </button>
      </div>
    </div>
  );
}
