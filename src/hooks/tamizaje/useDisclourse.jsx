import { useState } from "react";

export const useDisclourse = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  const onToggle = () => setIsOpen((p) => !p);
  return { isOpen, onClose, onOpen, onToggle };
};
