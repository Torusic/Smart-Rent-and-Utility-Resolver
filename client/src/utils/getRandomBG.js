export const getRandomBG = () => {
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#F1C40F",
    "#8E44AD",
    "#1ABC9C",
    "#E74C3C",
    "#2ECC71",
    "#3498DB",
    "#9B59B6",
    "#F39C12",
    "#16A085",
    "#D35400",
    "#7F8C8D",
    "#C0392B",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};