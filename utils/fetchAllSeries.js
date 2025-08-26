const fetchAllSeries = async () => {
  try {
    const JELLYFIN_URL = "https://your-ngrok-url.ngrok.io";
    const API_KEY = "your-api-key";
    const USER_ID = "your-user-id";

    const response = await fetch(
      `${JELLYFIN_URL}/Items?api_key=${API_KEY}&userId=${USER_ID}&IncludeItemTypes=Series&Recursive=true&Fields=BasicSyncInfo,PrimaryImageAspectRatio,ProductionYear,Status,EndDate`,
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
    console.error("Error fetching series:", error);
    return [];
  }
};
