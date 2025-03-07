export function checkCollision(character, obstacle) {
  // Get character position
  const charX = character.lane * 2;
  const charY = character.y;
  const charZ = character.z;
  
  // Character dimensions (adjust based on your model/representation)
  const charWidth = 1;
  const charHeight = character.sliding ? 0.5 : 1.5;
  const charDepth = 0.5;
  
  // Obstacle position and dimensions
  const obstacleX = obstacle.position.x;
  const obstacleY = obstacle.position.y;
  const obstacleZ = obstacle.position.z;
  
  // Obstacle dimensions (adjust based on the obstacle type)
  let obstacleWidth, obstacleHeight, obstacleDepth;
  
  switch (obstacle.type) {
    case 'barrier':
      obstacleWidth = 1.5;
      obstacleHeight = 2;
      obstacleDepth = 0.5;
      break;
    case 'lowBarrier':
      obstacleWidth = 3;
      obstacleHeight = 0.5;
      obstacleDepth = 0.5;
      break;
    case 'coin':
      obstacleWidth = 1;
      obstacleHeight = 1;
      obstacleDepth = 0.1;
      break;
    default:
      obstacleWidth = 1;
      obstacleHeight = 1;
      obstacleDepth = 1;
  }
  
  // Simple AABB collision detection
  const collision = (
    Math.abs(charX - obstacleX) < (charWidth + obstacleWidth) / 2 &&
    Math.abs(charY - obstacleY) < (charHeight + obstacleHeight) / 2 &&
    Math.abs(charZ - obstacleZ) < (charDepth + obstacleDepth) / 2
  );
  
  if (collision) {
    console.log('Collision detected:', {
      character: { x: charX, y: charY, z: charZ, width: charWidth, height: charHeight, depth: charDepth },
      obstacle: { x: obstacleX, y: obstacleY, z: obstacleZ, width: obstacleWidth, height: obstacleHeight, depth: obstacleDepth }
    });
  }
  
  return collision;
}