-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ConsentForm" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "expectations" TEXT,
    "areasToTreat" TEXT,
    "medicalConditions" TEXT,
    "medications" TEXT,
    "allergies" TEXT,
    "pregnancy" TEXT,
    "regularActivity" TEXT,
    "hadProfessionalMassage" TEXT,
    "stressLevel" TEXT,
    "signature" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConsentForm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ConsentForm_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ConsentForm" ("allergies", "areasToTreat", "birthDate", "createdAt", "expectations", "firstName", "hadProfessionalMassage", "id", "lastName", "medicalConditions", "medications", "phone", "pregnancy", "regularActivity", "signature", "stressLevel", "userId") SELECT "allergies", "areasToTreat", "birthDate", "createdAt", "expectations", "firstName", "hadProfessionalMassage", "id", "lastName", "medicalConditions", "medications", "phone", "pregnancy", "regularActivity", "signature", "stressLevel", "userId" FROM "ConsentForm";
DROP TABLE "ConsentForm";
ALTER TABLE "new_ConsentForm" RENAME TO "ConsentForm";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
