-- Migration: Add social media fields to Footer table
-- Database: city_shadows
-- Table: Footer
-- Description: Adds fields for social media links (Instagram, Facebook, X) and toggle to show/hide the section

-- Add showSocialMedia column (Boolean/TINYINT in MySQL)
ALTER TABLE `Footer` 
ADD COLUMN `showSocialMedia` TINYINT(1) NOT NULL DEFAULT 1 
AFTER `phoneValue`;

-- Add instagramLink column
ALTER TABLE `Footer` 
ADD COLUMN `instagramLink` VARCHAR(191) NOT NULL DEFAULT 'https://www.instagram.com' 
AFTER `showSocialMedia`;

-- Add facebookLink column
ALTER TABLE `Footer` 
ADD COLUMN `facebookLink` VARCHAR(191) NOT NULL DEFAULT 'https://www.facebook.com' 
AFTER `instagramLink`;

-- Add xLink column
ALTER TABLE `Footer` 
ADD COLUMN `xLink` VARCHAR(191) NOT NULL DEFAULT 'https://www.x.com' 
AFTER `facebookLink`;

-- Update existing records to have default values (if any exist)
UPDATE `Footer` 
SET 
  `showSocialMedia` = 1,
  `instagramLink` = 'https://www.instagram.com',
  `facebookLink` = 'https://www.facebook.com',
  `xLink` = 'https://www.x.com'
WHERE `showSocialMedia` IS NULL 
   OR `instagramLink` IS NULL 
   OR `facebookLink` IS NULL 
   OR `xLink` IS NULL;

-- Verify the columns were added
-- DESCRIBE `Footer`;

