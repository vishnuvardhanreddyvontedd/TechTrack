-- CreateEnum
CREATE TYPE "Category" AS ENUM ('FRONTEND', 'BACKEND', 'FULLSTACK', 'AI_ML', 'DEVOPS', 'MOBILE', 'DATA_SCIENCE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActivityDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapTemplate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "iconEmoji" TEXT NOT NULL DEFAULT '🗺️',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoadmapTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayTemplate" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 60,
    "resources" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "DayTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roadmap" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "dayTemplateId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapTemplate_slug_key" ON "RoadmapTemplate"("slug");

-- CreateIndex
CREATE INDEX "DayTemplate_templateId_idx" ON "DayTemplate"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "DayTemplate_templateId_dayNumber_key" ON "DayTemplate"("templateId", "dayNumber");

-- CreateIndex
CREATE INDEX "Roadmap_userId_idx" ON "Roadmap"("userId");

-- CreateIndex
CREATE INDEX "Roadmap_userId_isActive_idx" ON "Roadmap"("userId", "isActive");

-- CreateIndex
CREATE INDEX "Task_roadmapId_idx" ON "Task"("roadmapId");

-- CreateIndex
CREATE INDEX "Task_roadmapId_isComplete_idx" ON "Task"("roadmapId", "isComplete");

-- CreateIndex
CREATE UNIQUE INDEX "Task_roadmapId_dayTemplateId_key" ON "Task"("roadmapId", "dayTemplateId");

-- AddForeignKey
ALTER TABLE "DayTemplate" ADD CONSTRAINT "DayTemplate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "RoadmapTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "RoadmapTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_dayTemplateId_fkey" FOREIGN KEY ("dayTemplateId") REFERENCES "DayTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
