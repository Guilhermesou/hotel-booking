-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "pricePerNight" DECIMAL NOT NULL,
    "doubleBeds" INTEGER NOT NULL DEFAULT 0,
    "singleBeds" INTEGER NOT NULL DEFAULT 0,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "area" DECIMAL,
    "floor" INTEGER,
    "hasBalcony" BOOLEAN NOT NULL DEFAULT false,
    "viewType" TEXT,
    "hasWindow" BOOLEAN NOT NULL DEFAULT true,
    "bathroomType" TEXT NOT NULL DEFAULT 'private',
    "amenities" TEXT NOT NULL DEFAULT '',
    "cleaningStatus" TEXT NOT NULL DEFAULT 'CLEAN',
    "lastCleaned" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "images" TEXT NOT NULL DEFAULT '',
    "notes" TEXT,
    "maintenanceNotes" TEXT,
    "lastInspection" DATETIME,
    "inspectionStatus" TEXT NOT NULL DEFAULT 'APPROVED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Room" ("capacity", "category", "createdAt", "doubleBeds", "id", "number", "pricePerNight", "singleBeds", "status", "updatedAt") SELECT "capacity", "category", "createdAt", "doubleBeds", "id", "number", "pricePerNight", "singleBeds", "status", "updatedAt" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE UNIQUE INDEX "Room_number_key" ON "Room"("number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
