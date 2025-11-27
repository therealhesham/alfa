-- Migration: Add showStats field to OurClientsContent table
-- This field will be used to control the visibility of statistics section

ALTER TABLE `OurClientsContent` 
ADD COLUMN `showStats` BOOLEAN NOT NULL DEFAULT true 
AFTER `statsSubtitleEn`;

-- Update existing records to show stats by default
UPDATE `OurClientsContent` SET `showStats` = true WHERE `showStats` IS NULL;

