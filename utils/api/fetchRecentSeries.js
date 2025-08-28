import { API_KEY, JELLYFIN_URL, USER_ID } from '@utils/api/useJellyfin.js';

const fetchRecentSeries = async () => {
  try {

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

export default fetchRecentSeries;