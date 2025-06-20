-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "image_url" SET DEFAULT 'https://shop.songprinting.com/global/images/PublicShop/ProductSearch/prodgr_default_300.png';

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "customer" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
