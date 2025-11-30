-- Migration: Add quote fields to HomeContent table
-- Run this migration to add quote section fields to the database

ALTER TABLE `HomeContent` 
ADD COLUMN `quoteTitle` VARCHAR(191) NOT NULL DEFAULT 'في ظلال المدينة',
ADD COLUMN `quoteTitleEn` VARCHAR(191) NOT NULL DEFAULT 'At City Shadows',
ADD COLUMN `quoteText` TEXT NOT NULL,
ADD COLUMN `quoteTextEn` TEXT NOT NULL,
ADD COLUMN `quoteAuthor` VARCHAR(191) NOT NULL DEFAULT 'المدير التنفيذي',
ADD COLUMN `quoteAuthorEn` VARCHAR(191) NOT NULL DEFAULT 'Managing Director';

-- Update existing records with default values if needed
UPDATE `HomeContent` 
SET 
  `quoteText` = 'نؤمن أن العقارات هي أكثر بكثير من المباني والمساحات. إنها فن تشكيل أنماط الحياة المكررة وبناء مجتمعات تعكس الأناقة الخالدة والعيش الراقي.',
  `quoteTextEn` = 'We believe that real estate is far more than structures and spaces. It''s the art of shaping refined lifestyles and cultivating communities that reflect timeless elegance and elevated living.'
WHERE `quoteText` = '' OR `quoteTextEn` = '';

