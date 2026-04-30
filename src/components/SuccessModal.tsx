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
    navigate('/dashboard'); // מוביל לדף הבית כפי שביקשת
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-icon">✅</div>
        <h2 className="modal-title">שלב 1 הושלם בהצלחה!</h2>
        <p className="modal-text">הגדרות האסיפה ורשימת התלמידים נשמרו במערכת.</p>
        <button className="modal-btn" onClick={handleContinue}>
          להמשך - לדף הבית
        </button>
      </div>
    </div>
  );
}