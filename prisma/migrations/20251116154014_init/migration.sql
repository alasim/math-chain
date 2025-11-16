-- CreateEnum
CREATE TYPE "Operation" AS ENUM ('ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalculationNode" (
    "id" TEXT NOT NULL,
    "parentId" TEXT,
    "authorId" TEXT NOT NULL,
    "operation" "Operation",
    "rightOperand" DOUBLE PRECISION,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalculationNode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "CalculationNode_parentId_idx" ON "CalculationNode"("parentId");

-- CreateIndex
CREATE INDEX "CalculationNode_authorId_idx" ON "CalculationNode"("authorId");

-- AddForeignKey
ALTER TABLE "CalculationNode" ADD CONSTRAINT "CalculationNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CalculationNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalculationNode" ADD CONSTRAINT "CalculationNode_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
