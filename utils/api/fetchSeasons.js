const fetchSeasons = async (seriesId) => {
  try {
    const response = await fetch(
      `${JELLYFIN_URL}/Shows/${seriesId}/Seasons?api_key=${API_KEY}&userId=${USER_ID}&Fields=BasicSyncInfo,PrimaryImageAspectRatio`,
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
    console.error("Error fetching seasons:", error);
    return [];
  }
};
