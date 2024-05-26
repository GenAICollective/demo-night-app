export const animationVariants = {
  initial: { opacity: 0, x: 400, scale: 0.75 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
  exit: {
    opacity: 0,
    x: -400,
    scale: 0.75,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};
