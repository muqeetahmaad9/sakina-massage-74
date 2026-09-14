-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CorporateForm" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "organizationType" TEXT,
    "companyName" TEXT,
    "employeeCountRange" TEXT,
    "employeeCount" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CorporateForm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CorporateForm_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CorporateForm" ("birthDate", "companyName", "createdAt", "employeeCount", "employeeCountRange", "firstName", "id", "lastName", "organizationType", "phone", "userId") SELECT "birthDate", "companyName", "createdAt", "employeeCount", "employeeCountRange", "firstName", "id", "lastName", "organizationType", "phone", "userId" FROM "CorporateForm";
DROP TABLE "CorporateForm";
ALTER TABLE "new_CorporateForm" RENAME TO "CorporateForm";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
