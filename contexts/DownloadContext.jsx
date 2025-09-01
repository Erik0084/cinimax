import {
  cancelDownload as cancelDownloadManager,
  downloadVideo,
  getJellyfinDownloadUrl,
  pauseDownload as pauseDownloadManager,
  resumeDownload as resumeDownloadManager
} from '@/utils/downloadManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import React, { createContext, useContext, useEffect, useReducer } from 'react';

const DownloadContext = createContext();

// Download states
const DOWNLOAD_STATES = {
  PENDING: 'pending',
  DOWNLOADING: 'downloading',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

// Action types
const ACTIONS = {
  ADD_DOWNLOAD: 'ADD_DOWNLOAD',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
  UPDATE_STATUS: 'UPDATE_STATUS',
  REMOVE_DOWNLOAD: 'REMOVE_DOWNLOAD',
  LOAD_DOWNLOADS: 'LOAD_DOWNLOADS',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED'
};

// Reducer function
const downloadReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_DOWNLOAD:
      return {
        ...state,
        downloads: [...state.downloads, action.payload]
      };
    
    case ACTIONS.UPDATE_PROGRESS:
      return {
        ...state,
        downloads: state.downloads.map(download =>
          download.id === action.payload.id
            ? { ...download, progress: action.payload.progress }
            : download
        )
      };
    
    case ACTIONS.UPDATE_STATUS:
      return {
        ...state,
        downloads: state.downloads.map(download =>
          download.id === action.payload.id
            ? { ...download, status: action.payload.status, ...action.payload.data, image: download.image }
            : download
        )
      };
    
    case ACTIONS.REMOVE_DOWNLOAD:
      return {
        ...state,
        downloads: state.downloads.filter(download => download.id !== action.payload.id)
      };
    
    case ACTIONS.LOAD_DOWNLOADS:
      return {
        ...state,
        downloads: action.payload.map(download => ({
          ...download,
          image: download.image || 'https://via.placeholder.com/300x450'
        }))
      };
    
    case ACTIONS.CLEAR_COMPLETED:
      return {
        ...state,
        downloads: state.downloads.filter(download => download.status !== DOWNLOAD_STATES.COMPLETED)
      };
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  downloads: []
};

// Download Provider Component
export const DownloadProvider = ({ children }) => {
  const [state, dispatch] = useReducer(downloadReducer, initialState);
  const downloadRefs = React.useRef(new Map());

  // Load downloads from storage on mount
  useEffect(() => {
    loadDownloadsFromStorage();
  }, []);

  // Save downloads to storage whenever state changes
  useEffect(() => {
    saveDownloadsToStorage();
  }, [state.downloads]);

  const loadDownloadsFromStorage = async () => {
    try {
      const storedDownloads = await AsyncStorage.getItem('downloads');
      if (storedDownloads) {
        const downloads = JSON.parse(storedDownloads);
        dispatch({ type: ACTIONS.LOAD_DOWNLOADS, payload: downloads });
      }
    } catch (error) {
      console.error('Error loading downloads from storage:', error);
    }
  };

  const saveDownloadsToStorage = async () => {
    try {
      await AsyncStorage.setItem('downloads', JSON.stringify(state.downloads));
    } catch (error) {
      console.error('Error saving downloads to storage:', error);
    }
  };

  const startDownload = async (item, serverConfig) => {
    const downloadId = `${item.Id}_${Date.now()}`;
    const fileName = `${item.Name || item.SeriesName || 'Unknown'}.mp4`;
    
    const downloadItem = {
      id: downloadId,
      itemId: item.Id,
      jellyfinId: item.Id, // Add jellyfinId for player navigation
      title: item.Name || item.SeriesName || 'Unknown Title',
      type: item.Type || 'Video',
      image: item.PrimaryImageAspectRatio ? 
        `${serverConfig.serverUrl}/Items/${item.Id}/Images/Primary` : 
        'https://via.placeholder.com/300x450',
      progress: 0,
      status: DOWNLOAD_STATES.PENDING,
      size: '0 MB',
      category: item.Genres?.[0] || 'Unknown',
      fileName,
      createdAt: new Date().toISOString()
    };

    // Add to downloads list
    dispatch({ type: ACTIONS.ADD_DOWNLOAD, payload: downloadItem });

    try {
      // Update status to downloading
      dispatch({ 
        type: ACTIONS.UPDATE_STATUS, 
        payload: { id: downloadId, status: DOWNLOAD_STATES.DOWNLOADING }
      });

      const downloadUrl = getJellyfinDownloadUrl(
        serverConfig.serverUrl,
        item.Id,
        serverConfig.apiKey
      );

      const headers = {
        Authorization: `MediaBrowser Token="${serverConfig.apiKey}"`,
        'User-Agent': 'JellyfinApp/1.0.0',
      };

      // Start download with progress callback
      const result = await downloadVideo(
        downloadUrl, 
        fileName, 
        headers,
        (progress) => {
          const progressPercent = (progress.totalBytesWritten / progress.totalBytesExpectedToWrite);
          const sizeInMB = (progress.totalBytesExpectedToWrite / (1024 * 1024)).toFixed(2);
          
          dispatch({ 
            type: ACTIONS.UPDATE_PROGRESS, 
            payload: { id: downloadId, progress: progressPercent }
          });
          
          dispatch({ 
            type: ACTIONS.UPDATE_STATUS, 
            payload: { 
              id: downloadId, 
              status: DOWNLOAD_STATES.DOWNLOADING,
              data: { size: `${sizeInMB} MB` }
            }
          });
        },
        downloadId // Pass downloadId for management
      );

      if (result) {
        // Get actual file size from the downloaded file
        let actualSize = '0 MB';
        try {
          const fileInfo = await FileSystem.getInfoAsync(result);
          if (fileInfo.exists && fileInfo.size) {
            const sizeInMB = (fileInfo.size / (1024 * 1024)).toFixed(2);
            actualSize = `${sizeInMB} MB`;
          }
        } catch (error) {
          console.error('Error getting file size:', error);
          // Fallback to current download size if file size check fails
          const currentDownload = state.downloads.find(d => d.id === downloadId);
          actualSize = currentDownload?.size || '0 MB';
        }
        
        dispatch({ 
          type: ACTIONS.UPDATE_PROGRESS, 
          payload: { id: downloadId, progress: 1.0 }
        });
        dispatch({ 
          type: ACTIONS.UPDATE_STATUS, 
          payload: { 
            id: downloadId, 
            status: DOWNLOAD_STATES.COMPLETED,
            data: { 
              filePath: result,
              size: actualSize
            }
          }
        });
      } else {
        dispatch({ 
          type: ACTIONS.UPDATE_STATUS, 
          payload: { id: downloadId, status: DOWNLOAD_STATES.FAILED }
        });
      }
    } catch (error) {
      console.error('Download failed:', error);
      dispatch({ 
        type: ACTIONS.UPDATE_STATUS, 
        payload: { id: downloadId, status: DOWNLOAD_STATES.FAILED }
      });
    }
  };

  const pauseDownload = async (downloadId) => {
    try {
      const success = await pauseDownloadManager(downloadId);
      if (success) {
        dispatch({ 
          type: ACTIONS.UPDATE_STATUS, 
          payload: { id: downloadId, status: DOWNLOAD_STATES.PAUSED }
        });
      }
    } catch (error) {
      console.error('Error pausing download:', error);
    }
  };

  const resumeDownload = async (downloadId) => {
    try {
      dispatch({ 
        type: ACTIONS.UPDATE_STATUS, 
        payload: { id: downloadId, status: DOWNLOAD_STATES.DOWNLOADING }
      });
      
      const result = await resumeDownloadManager(downloadId);
      if (result) {
        // Get actual file size from the downloaded file
        let actualSize = '0 MB';
        try {
          const fileInfo = await FileSystem.getInfoAsync(result);
          if (fileInfo.exists && fileInfo.size) {
            const sizeInMB = (fileInfo.size / (1024 * 1024)).toFixed(2);
            actualSize = `${sizeInMB} MB`;
          }
        } catch (error) {
          console.error('Error getting file size:', error);
          // Fallback to current download size if file size check fails
          const currentDownload = state.downloads.find(d => d.id === downloadId);
          actualSize = currentDownload?.size || '0 MB';
        }
        
        dispatch({ 
          type: ACTIONS.UPDATE_PROGRESS, 
          payload: { id: downloadId, progress: 1.0 }
        });
        dispatch({ 
          type: ACTIONS.UPDATE_STATUS, 
          payload: { 
            id: downloadId, 
            status: DOWNLOAD_STATES.COMPLETED,
            data: { 
              filePath: result,
              size: actualSize
            }
          }
        });
      }
    } catch (error) {
      console.error('Error resuming download:', error);
      dispatch({ 
        type: ACTIONS.UPDATE_STATUS, 
        payload: { id: downloadId, status: DOWNLOAD_STATES.FAILED }
      });
    }
  };

  const cancelDownload = async (downloadId) => {
    try {
      await cancelDownloadManager(downloadId);
      dispatch({ type: ACTIONS.REMOVE_DOWNLOAD, payload: { id: downloadId } });
    } catch (error) {
      console.error('Error cancelling download:', error);
      // Still remove from UI even if cancellation fails
      dispatch({ type: ACTIONS.REMOVE_DOWNLOAD, payload: { id: downloadId } });
    }
  };

  const removeDownload = async (downloadId) => {
    try {
      // Find the download item to get file path
      const downloadItem = state.downloads.find(d => d.id === downloadId);
      
      if (downloadItem && downloadItem.status === DOWNLOAD_STATES.COMPLETED) {
        // Construct file path based on download structure
        const downloadDir = `${FileSystem.documentDirectory}downloads/`;
        const filePath = downloadItem.filePath || `${downloadDir}${downloadItem.fileName}`;
        
        // Check if file exists and delete it
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(filePath);
          console.log('File deleted from device:', filePath);
        }
      }
    } catch (error) {
      console.error('Error deleting file from device:', error);
    }
    
    // Remove from downloads list regardless of file deletion success
    dispatch({ type: ACTIONS.REMOVE_DOWNLOAD, payload: { id: downloadId } });
  };

  const clearCompleted = async () => {
    try {
      // Get all completed downloads
      const completedDownloads = state.downloads.filter(d => d.status === DOWNLOAD_STATES.COMPLETED);
      
      // Delete files for each completed download
      for (const downloadItem of completedDownloads) {
        const downloadDir = `${FileSystem.documentDirectory}downloads/`;
        const filePath = downloadItem.filePath || `${downloadDir}${downloadItem.fileName}`;
        
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(filePath);
          console.log('File deleted from device:', filePath);
        }
      }
    } catch (error) {
      console.error('Error deleting completed files from device:', error);
    }
    
    dispatch({ type: ACTIONS.CLEAR_COMPLETED });
  };

  const getDownloadById = (downloadId) => {
    return state.downloads.find(download => download.id === downloadId);
  };

  const getDownloadsByStatus = (status) => {
    return state.downloads.filter(download => download.status === status);
  };

  const value = {
    downloads: state.downloads,
    startDownload,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    removeDownload,
    clearCompleted,
    getDownloadById,
    getDownloadsByStatus,
    DOWNLOAD_STATES
  };

  return (
    <DownloadContext.Provider value={value}>
      {children}
    </DownloadContext.Provider>
  );
};

// Custom hook to use download context
export const useDownloads = () => {
  const context = useContext(DownloadContext);
  if (!context) {
    throw new Error('useDownloads must be used within a DownloadProvider');
  }
  return context;
};

export { DOWNLOAD_STATES };
