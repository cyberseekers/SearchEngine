export const fetchTools = async () => {
  try {
    const response = await fetch("/api/tools"); 
    if (!response.ok) {
      throw new Error("Failed to fetch tools");
    }
    return await response.json(); 
  } catch (error) {
    console.error("Error fetching tools:", error);
    throw error; 
  }
};
export const calculateTimeTaken = (startTime, endTime) => {
  return endTime - startTime;
};

export const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
