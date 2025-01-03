import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ReactNode } from 'react';
import { useEscapeKey } from '@/hooks/use-escape-key';
import '@/lib/styles/modal-animations.css';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const ANIMATION_DURATION = 300;
const modalStyle = {
  background:
    'radial-gradient(circle, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.0) 70%, rgba(0,0,0,0.0) 100%)',
  backdropFilter: 'blur(4px)',
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setIsVisible(true);
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, ANIMATION_DURATION);
  };

  useEscapeKey(handleClose);

  return (
    <div
      className={`w-full fixed inset-0 z-50 flex items-center justify-center transition-all ${
        isVisible ? 'modal-open' : 'modal-close'
      }`}
      onClick={handleClose}
      style={{
        animation: isVisible
          ? 'modalOpen 0.3s forwards'
          : 'modalClose 0.3s forwards',
        ...modalStyle,
      }}
    >
      <div
        className="relative flex flex-col justify-center bg-white bg-opacity-100 p-6 rounded-lg shadow-2xl mx-4 max-w-md w-full sm:w-3/4 md:w-2/4 lg:w-1/3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 p-1 text-black text-lg hover:bg-black/20 rounded-full transition-all duration-200"
          onClick={handleClose}
        >
          <X className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
}
