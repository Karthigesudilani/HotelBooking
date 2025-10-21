/**
 * Utility functions for handling room images
 */

// Import images from assets
import standardRoomImg from '../assets/hotel-room.jpg'
import deluxeRoomImg from '../assets/what-is-a-deluxe-room-2-1024x675.jpg'
import familySuiteImg from '../assets/3d-rendering-luxury-bedroom-suite-resort-hotel-with-twin-bed-living_105762-2018.jpg'
import defaultRoomImg from '../assets/hotel-room-design-compressed-1.jpg'

// Room type to image mapping
const roomImageMap = {
  'Standard Room': standardRoomImg,
  'Deluxe Room': deluxeRoomImg,
  'Family Suite': familySuiteImg,
}

// Room ID to image mapping (based on seeder data)
const roomIdImageMap = {
  1: standardRoomImg,    // Standard Room (ID 1)
  2: deluxeRoomImg,      // Deluxe Room (ID 2)
  3: familySuiteImg,     // Family Suite (ID 3)
}

/**
 * Get room image based on room ID
 * @param {number} roomId - The room ID
 * @returns {string} - Image path
 */
export function getRoomImageById(roomId) {
  return roomIdImageMap[roomId] || defaultRoomImg
}

/**
 * Get room image based on room name
 * @param {string} roomName - The room name (e.g., 'Standard Room', 'Deluxe Room', 'Family Suite')
 * @returns {string} - Image path
 */
export function getRoomImageByName(roomName) {
  return roomImageMap[roomName] || defaultRoomImg
}

/**
 * Get room image based on room object
 * @param {Object} room - The room object with id or room_name property
 * @returns {string} - Image path
 */
export function getRoomImage(room) {
  if (!room) return defaultRoomImg
  
  // Try by ID first
  if (room.id && roomIdImageMap[room.id]) {
    return roomIdImageMap[room.id]
  }
  
  // Try by room name
  if (room.room_name && roomImageMap[room.room_name]) {
    return roomImageMap[room.room_name]
  }
  
  // Fallback to default
  return defaultRoomImg
}

/**
 * Get all available room images
 * @returns {Array} - Array of image paths
 */
export function getAllRoomImages() {
  return Object.values(roomImageMap)
}

/**
 * Get room type from room ID
 * @param {number} roomId - The room ID
 * @returns {string} - Room type name
 */
export function getRoomTypeById(roomId) {
  const roomTypeMap = {
    1: 'Standard Room',
    2: 'Deluxe Room', 
    3: 'Family Suite'
  }
  return roomTypeMap[roomId] || 'Unknown Room'
}

export default {
  getRoomImageById,
  getRoomImageByName,
  getRoomImage,
  getAllRoomImages,
  getRoomTypeById
}
