import { API_KEY, JELLYFIN_URL, USER_ID } from "./useJellyfin";

// Search for series and movies based on query
export const searchJellyfinContent = async (searchQuery) => {
  if (!searchQuery || searchQuery.trim().length === 0) {
    return [];
  }

  try {
    const response = await fetch(
      `${JELLYFIN_URL}/Items?api_key=${API_KEY}&userId=${USER_ID}&searchTerm=${encodeURIComponent(
        searchQuery
      )}&IncludeItemTypes=Series,Movie&Recursive=true&Fields=BasicSyncInfo,PrimaryImageAspectRatio,ProductionYear,Status,EndDate,Overview,Genres,RunTimeTicks,OfficialRating&Limit=50`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.Items || [];
  } catch (error) {
    console.error("Error searching Jellyfin content:", error);
    return [];
  }
};

// Get image URL for Jellyfin items
export const getJellyfinImageUrl = (itemId, imageType = "Primary") => {
  if (!itemId) return null;
  return `${JELLYFIN_URL}/Items/${itemId}/Images/${imageType}?api_key=${API_KEY}`;
};

// Format runtime from ticks to minutes
export const formatRuntime = (runTimeTicks) => {
  if (!runTimeTicks) return null;
  const minutes = Math.round(runTimeTicks / 600000000); // Convert from ticks to minutes
  return minutes;
};

export const getFeaturedMovies = async (query) => {
  try {
    const response = await fetch(
      `${JELLYFIN_URL}/Items?api_key=${API_KEY}&userId=${USER_ID}&searchTerm=${query}&IncludeItemTypes=Series,Movie&Recursive=true&Fields=BasicSyncInfo,PrimaryImageAspectRatio,ProductionYear,Status,EndDate,Overview,Genres,RunTimeTicks,OfficialRating&Limit=1`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.Items || [];
  } catch (error) {
    console.error("Error fetching featured movies:", error);
    return [];
  }
};
