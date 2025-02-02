export const getAvatarColor = (name) => {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F4A261', '#2A9D8F'];
  if (!name || name === 'None') return '#BDBDBD'; // Default gray color for "None"
  const index = name.charCodeAt(0) % colors.length; // Get color based on first letter
  return colors[index];
};
