-- Migration: Add showStats field to OurProjectsContent table
-- This field will be used to control the visibility of statistics section

ALTER TABLE `OurProjectsContent` 
ADD COLUMN `showStats` BOOLEAN NOT NULL DEFAULT true 
AFTER `heroSubtitleEn`;

-- Update existing records to show stats by default
UPDATE `OurProjectsContent` SET `showStats` = true WHERE `showStats` IS NULL;

