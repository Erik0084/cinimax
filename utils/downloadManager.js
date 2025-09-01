// utils/downloadManager.js
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";

// Network connectivity check
export const checkJellyfinConnection = async (serverUrl, apiKey) => {
  try {
    const response = await fetch(`${serverUrl}/System/Info?api_key=${apiKey}`, {
      method: "GET",
      timeout: 10000, // 10 second timeout
      headers: {
        Authorization: `MediaBrowser Token="${apiKey}"`,
        "User-Agent": "JellyfinApp/1.0.0",
      },
    });

    if (response.ok) {
      console.log("Jellyfin server connection successful");
      return true;
    } else {
      console.error("Jellyfin server responded with error:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Failed to connect to Jellyfin server:", error.message);
    return false;
  }
};

// Store active download resumables for management
const activeDownloads = new Map();

export const downloadVideo = async (
  videoUrl,
  fileName,
  headers = {},
  onProgress = null,
  downloadId = null
) => {
  try {
    // Extract server URL from video URL for connection check
    const urlParts = videoUrl.match(/(https?:\/\/[^/]+)/);
    if (urlParts && urlParts[1]) {
      const serverUrl = urlParts[1];
      const apiKeyMatch = videoUrl.match(/api_key=([^&]+)/);
      const apiKey = apiKeyMatch ? apiKeyMatch[1] : "";

      // Check connection before attempting download
      const isConnected = await checkJellyfinConnection(serverUrl, apiKey);
      if (!isConnected) {
        throw new Error(
          "Cannot connect to Jellyfin server. Please check your network connection and server settings."
        );
      }
    }
    // No permissions needed for app document directory

    // Create download directory if it doesn't exist
    const downloadDir = `${FileSystem.documentDirectory}downloads/`;
    const dirInfo = await FileSystem.getInfoAsync(downloadDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
    }

    const fileUri = `${downloadDir}${fileName}`;

    // Check if file already exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      Alert.alert(
        "File Exists",
        "This video is already downloaded. Do you want to download it again?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Re-download",
            onPress: async () => {
              await FileSystem.deleteAsync(fileUri);
              return downloadVideo(videoUrl, fileName, headers);
            },
          },
        ]
      );
      return fileUri;
    }

    // Start download with progress tracking and timeout
    const downloadResumable = FileSystem.createDownloadResumable(
      videoUrl,
      fileUri,
      {
        headers,
        // Add timeout and retry settings
        sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
      },
      (progress) => {
        const progressPercent =
          (progress.totalBytesWritten / progress.totalBytesExpectedToWrite) *
          100;
        // console.log(`Download Progress: ${progressPercent.toFixed(2)}%`);

        // Call the progress callback if provided
        if (onProgress && typeof onProgress === "function") {
          onProgress(progress);
        }
      }
    );

    // Store the download resumable for management if downloadId is provided
    if (downloadId) {
      activeDownloads.set(downloadId, downloadResumable);
    }

    // Add timeout wrapper
    const downloadWithTimeout = () => {
      return Promise.race([
        downloadResumable.downloadAsync(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Download timeout after 5 minutes")),
            300000
          )
        ),
      ]);
    };

    const result = await downloadWithTimeout();

    // Remove from active downloads when completed
    if (downloadId) {
      activeDownloads.delete(downloadId);
    }

    if (result && result.uri) {
      // Download completed successfully - no popups
      console.log("Video downloaded successfully to:", result.uri);
      return result.uri;
    }

    return null;
  } catch (error) {
    console.error("Download error:", error);
    Alert.alert(
      "Download Failed",
      `Failed to download video: ${error.message}`
    );
    return null;
  }
};

export const getJellyfinDownloadUrl = (serverUrl, itemId, apiKey) => {
  return `${serverUrl}/Items/${itemId}/Download?api_key=${apiKey}`;
};

export const getDownloadedVideos = async () => {
  try {
    const downloadDir = `${FileSystem.documentDirectory}downloads/`;
    const files = await FileSystem.readDirectoryAsync(downloadDir);
    return files;
  } catch (error) {
    console.error("Error reading downloads:", error);
    return [];
  }
};

// Download management functions
export const pauseDownload = async (downloadId) => {
  try {
    const downloadResumable = activeDownloads.get(downloadId);
    if (downloadResumable) {
      await downloadResumable.pauseAsync();
      console.log(`Download ${downloadId} paused`);
      return true;
    }
    console.warn(`Download ${downloadId} not found in active downloads`);
    return false;
  } catch (error) {
    console.error(`Error pausing download ${downloadId}:`, error);
    return false;
  }
};

export const resumeDownload = async (downloadId) => {
  try {
    const downloadResumable = activeDownloads.get(downloadId);
    if (downloadResumable) {
      const result = await downloadResumable.resumeAsync();
      console.log(`Download ${downloadId} resumed`);
      return result && result.uri ? result.uri : null;
    }
    console.warn(`Download ${downloadId} not found in active downloads`);
    return null;
  } catch (error) {
    console.error(`Error resuming download ${downloadId}:`, error);
    return null;
  }
};

export const cancelDownload = async (downloadId) => {
  try {
    const downloadResumable = activeDownloads.get(downloadId);
    if (downloadResumable) {
      await downloadResumable.cancelAsync();
      activeDownloads.delete(downloadId);
      console.log(`Download ${downloadId} cancelled`);
      return true;
    }
    console.warn(`Download ${downloadId} not found in active downloads`);
    return false;
  } catch (error) {
    console.error(`Error cancelling download ${downloadId}:`, error);
    return false;
  }
};

// Get active download status
export const getActiveDownloadStatus = (downloadId) => {
  return activeDownloads.has(downloadId);
};

// Get all active download IDs
export const getActiveDownloadIds = () => {
  return Array.from(activeDownloads.keys());
};
