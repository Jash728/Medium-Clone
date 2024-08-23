-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SPORTS', 'NEWS', 'CRIME', 'OTHERS');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "categories" "Category" NOT NULL DEFAULT 'OTHERS';
