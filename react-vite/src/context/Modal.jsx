import { useRef, useState, useContext, createContext } from 'react';
import ReactDOM from 'react-dom';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null);
  const [onModalClose, setOnModalClose] = useState(null);

  const closeModal = () => {
    setModalContent(null);
    if (typeof onModalClose === 'function') {
      setOnModalClose(null);
      onModalClose();
    }
  };

  const contextValue = {
    modalRef,
    modalContent,
    setModalContent,
    setOnModalClose,
    closeModal,
  };

  return (
    <>
      <ModalContext.Provider value={contextValue}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

export function Modal() {
  const { modalRef, modalContent, closeModal } = useContext(ModalContext);

  if (!modalRef || !modalRef.current || !modalContent) return null;

  return ReactDOM.createPortal(
    <div
      id="modal"
      className="fixed inset-0 flex justify-center items-center z-[1000]"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div
        id="modal-background"
        className="fixed inset-0 bg-black bg-opacity-70"
        onClick={closeModal}
      />
      <div
        id="modal-content"
        className="relative bg-white max-w-lg w-[90%] p-6 rounded-lg shadow-lg z-[1010] outline-none"
      >
        {modalContent}
      </div>
    </div>,
    modalRef.current
  );
}

export const useModal = () => useContext(ModalContext);
