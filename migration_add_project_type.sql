-- Migration: Add projectType field to Project table
-- This field will be used to categorize projects as "commercial" or "residential"

ALTER TABLE `Project` 
ADD COLUMN `projectType` VARCHAR(191) NULL DEFAULT 'commercial' 
AFTER `categoryEn`;

-- Update existing projects to have a default value
UPDATE `Project` SET `projectType` = 'commercial' WHERE `projectType` IS NULL;

