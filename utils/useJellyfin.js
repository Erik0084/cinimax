// utils/useJellyfin.js

export let JELLYFIN_URL = "http://192.168.240.202:8096";
export let API_KEY =
  process.env.JELLYFIN_API_KEY || "4a8f78d0e0eb4b7f8957732ee343a3b0";
export let USER_ID =
  process.env.JELLYFIN_USER_ID || "ee199cb3177a4b4fa1ffe22d10f9857e";

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

    // console.log("response", response);
    const data = await response.json();
    // console.log("data", data);
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

// fetch collections
export const fetchCollections = async () => {
  try {
    const response = await fetch(
      `${JELLYFIN_URL}/Items?api_key=${API_KEY}&userId=${USER_ID}&IncludeItemTypes=BoxSet&Recursive=true`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data.Items || [];
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
};

// fetch collection items
export const fetchCollectionItems = async (collectionId) => {
  try {
    const response = await fetch(
      `${JELLYFIN_URL}/Items?api_key=${API_KEY}&userId=${USER_ID}&ParentId=${collectionId}&IncludeItemTypes=Series`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data.Items || [];
  } catch (error) {
    console.error("Error fetching collection items:", error);
    return [];
  }
};

// fetch all episodes from a collection
export const fetchAllEpisodesFromCollection = async (collectionId) => {
  try {
    // First, get all series in the collection
    const seriesResponse = await fetch(
      `${JELLYFIN_URL}/Items?api_key=${API_KEY}&userId=${USER_ID}&ParentId=${collectionId}&IncludeItemTypes=Series&Recursive=true`
    );
    const series = (await seriesResponse.json()).Items || [];

    // Then fetch all episodes for each series
    const allEpisodes = [];

    for (const seriesItem of series) {
      const episodesResponse = await fetch(
        `${JELLYFIN_URL}/Shows/${seriesItem.Id}/Episodes?api_key=${API_KEY}&userId=${USER_ID}&Fields=Overview,ParentId`
      );
      const episodesData = await episodesResponse.json();

      // Add series info to each episode
      const episodesWithSeriesInfo = (episodesData.Items || []).map(
        (episode) => ({
          ...episode,
          SeriesName: seriesItem.Name,
          SeriesId: seriesItem.Id,
          SeriesYear: seriesItem.ProductionYear,
        })
      );

      allEpisodes.push(...episodesWithSeriesInfo);
    }

    return allEpisodes;
  } catch (error) {
    console.error("Error fetching episodes from collection:", error);
    return [];
  }
};

export const fetchRecentSeries = async () => {
  try {
    // const JELLYFIN_URL = "https://your-ngrok-url.ngrok.io";
    // const API_KEY = "your-api-key";
    // const USER_ID = "your-user-id";

    const response = await fetch(
      `${JELLYFIN_URL}/Items?api_key=${API_KEY}&userId=${USER_ID}&IncludeItemTypes=Series&Recursive=true&Fields=BasicSyncInfo,PrimaryImageAspectRatio,ProductionYear,Status,EndDate&SortBy=DateCreated&SortOrder=Descending`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data.Items || [];
  } catch (error) {
    console.error("Error fetching recent series:", error);
    return [];
  }
};
