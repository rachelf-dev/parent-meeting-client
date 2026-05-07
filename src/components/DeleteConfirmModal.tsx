import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title }: Props) {
  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚠️</div>
        <h3 style={{ margin: '0 0 10px 0' }}>אישור מחיקה</h3>
        <p>האם אתה בטוח שברצונך למחוק את האילוץ של הורה <strong>{title}</strong>?</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
          <button onClick={onConfirm} style={confirmBtnStyle}>מחק</button>
          <button onClick={onClose} style={cancelBtnStyle}>ביטול</button>
        </div>
      </div>
    </div>
  );
}

// סטייל פנימי פשוט ל-Modal (ניתן להעביר ל-CSS)
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center', width: '320px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
};

const confirmBtnStyle = { backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' };
const cancelBtnStyle = { backgroundColor: '#edf2f7', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' };