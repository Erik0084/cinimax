// utils/useJellyfin.js

export const JELLYFIN_URL = "http://192.168.108.202:8096";
export const API_KEY = "4a8f78d0e0eb4b7f8957732ee343a3b0";
export const USER_ID = "ee199cb3177a4b4fa1ffe22d10f9857e";

// fetch all series
export const fetchAllSeries = async () => {
  try {
    const response = await fetch(
      `${JELLYFIN_URL}/Items?api_key=${API_KEY}&userId=${USER_ID}&IncludeItemTypes=Series&Recursive=true&Fields=BasicSyncInfo,PrimaryImageAspectRatio,ProductionYear,Status,EndDate`,
      {
        method: "GET",  
        headers: {
          Accept: "application/json",  
          "Content-Type": "application/json",  
        //   "ngrok-skip-browser-warning": "true",
        },    
      }  
    );

    console.log("response", response);  
    const data = await response.json();
    console.log("data", data);
    return data.Items || [];  
  } catch (error) {  
    console.error("Error fetching series:", error);
    return [];
  }
};

// fetch seasons
export const fetchSeasons = async (seriesId) => {
  try {
    const response = await fetch(
      `${JELLYFIN_URL}/Shows/${seriesId}/Seasons?api_key=${API_KEY}&userId=${USER_ID}&Fields=BasicSyncInfo,PrimaryImageAspectRatio`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    return data.Items || [];
  } catch (error) {
    console.error("Error fetching seasons:", error);
    return [];
  }
};

// fetch episodes
export const fetchEpisodes = async (seriesId, seasonId) => {
  try {
    const response = await fetch(
      `${JELLYFIN_URL}/Shows/${seriesId}/Episodes?api_key=${API_KEY}&userId=${USER_ID}&seasonId=${seasonId}&Fields=BasicSyncInfo,PrimaryImageAspectRatio,Overview`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.Items || [];
  } catch (error) {
    console.error("Error fetching episodes:", error);
    return [];
  }
};
