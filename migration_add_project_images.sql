-- Migration: Add images field to Project table
-- Database: city_shadows
-- Table: Project

-- Add images column to store JSON array of additional project images
ALTER TABLE `Project` 
ADD COLUMN `images` TEXT NULL 
AFTER `image`;

-- Optional: Add index if you plan to search by images (usually not needed for JSON)
-- CREATE INDEX `idx_project_images` ON `Project`(`images`(255));

-- Verify the column was added
-- DESCRIBE `Project`;

