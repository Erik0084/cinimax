import { Icons } from '@/constants/icons';
import { useDownloads } from '@/contexts/DownloadContext';
import { router } from 'expo-router';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';

const DownloadCard = ({ item }) => {
    const { pauseDownload, resumeDownload, cancelDownload, removeDownload, DOWNLOAD_STATES } = useDownloads();
    
    const isDownloading = item.status === DOWNLOAD_STATES.DOWNLOADING;
    const isPaused = item.status === DOWNLOAD_STATES.PAUSED;
    const isCompleted = item.status === DOWNLOAD_STATES.COMPLETED;
    const isFailed = item.status === DOWNLOAD_STATES.FAILED;
    
    const handlePauseResume = () => {
        if (isDownloading) {
            pauseDownload(item.id);
        } else if (isPaused) {
            resumeDownload(item.id);
        }
    };
    
    const handleCancel = () => {
        const action = (isDownloading || isPaused) ? 'cancel' : 'delete';
        const message = action === 'cancel' 
            ? 'Are you sure you want to cancel this download?' 
            : 'Are you sure you want to delete this download from your list?';
            
        Alert.alert(
            `${action.charAt(0).toUpperCase() + action.slice(1)} Download`,
            message,
            [
                {
                    text: 'No',
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    style: 'destructive',
                    onPress: async () => {
                        if (isDownloading || isPaused) {
                            cancelDownload(item.id);
                        } else {
                            await removeDownload(item.id);
                        }
                    }
                }
            ]
        );
    };
    
    const handlePlayDownload = () => {
        if (isCompleted && item.jellyfinId) {
            router.push(`/media/player/${item.jellyfinId}`);
        }
    };
    
    const getStatusText = () => {
        switch (item.status) {
            case DOWNLOAD_STATES.PENDING:
                return 'Pending...';
            case DOWNLOAD_STATES.DOWNLOADING:
                return 'Downloading...';
            case DOWNLOAD_STATES.PAUSED:
                return 'Paused';
            case DOWNLOAD_STATES.COMPLETED:
                return 'Completed';
            case DOWNLOAD_STATES.FAILED:
                return 'Failed';
            case DOWNLOAD_STATES.CANCELLED:
                return 'Cancelled';
            default:
                return 'Unknown';
        }
    };
    
    const getStatusColor = () => {
        switch (item.status) {
            case DOWNLOAD_STATES.DOWNLOADING:
                return 'text-blue_accent';
            case DOWNLOAD_STATES.COMPLETED:
                return 'text-blue_accent';
            case DOWNLOAD_STATES.FAILED:
                return 'text-red-500';
            case DOWNLOAD_STATES.PAUSED:
                return 'text-yellow-500';
            default:
                return 'text-grey';
        }
    };
    const CardContent = () => (
        <>
            <View>
                <Image 
                    source={{ uri: item.image || 'https://via.placeholder.com/300x450' }} 
                    className="w-auto h-[80px] rounded-xl" 
                    style={{ aspectRatio: 2 / 2 }} 
                />
            </View>
            <View className="flex-1">
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                        {/* <Text className="text-grey text-sm mb-1">{item.category}</Text> */}
                        <Text className="text-white text-lg font-semibold">{item.title}</Text>
                        {isCompleted && (
                            <Text className="text-blue_accent text-xs mt-1">Tap to play</Text>
                        )}
                    </View>
                    <View className="flex-row gap-2">
                        {(isDownloading || isPaused) && (
                            <TouchableOpacity onPress={handlePauseResume}>
                                <Image 
                                    source={isDownloading ? Icons.pause : Icons.PlayButton} 
                                    className="w-6 h-6 tint-white" 
                                />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={handleCancel}>
                            <Image source={Icons.remove} className="w-6 h-6 tint-red-500" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Progress bar - show for downloading, paused, and completed */}
                {(isDownloading || isPaused || isCompleted) && (
                    <View className="h-1 bg-gray-700 rounded-full mb-2">
                        <View
                            className="h-1 bg-blue_accent rounded-full"
                            style={{ width: `${(item.progress || 0) * 100}%` }}
                        />
                    </View>
                )}
                
                <View className="flex-row justify-between items-center">
                    <Text className="text-grey text-xs">
                        {item.type || 'Video'} | {item.size || '0 MB'}
                        {(isDownloading || isPaused || isCompleted) && ` | ${Math.round((item.progress || 0) * 100)}%`}
                    </Text>
                    <Text className={`text-xs ${getStatusColor()}`}>
                        {getStatusText()}
                    </Text>
                </View>
            </View>
        </>
    );

    return (
        <View className="bg-soft rounded-xl mb-4">
            {isCompleted ? (
                <TouchableOpacity 
                    onPress={handlePlayDownload}
                    className="flex-row gap-3 items-center p-3"
                    activeOpacity={0.7}
                >
                    <CardContent />
                </TouchableOpacity>
            ) : (
                <View className="flex-row gap-3 items-center p-3">
                    <CardContent />
                </View>
            )}
        </View>
    )
}

export default DownloadCard