/*
  Warnings:

  - A unique constraint covering the columns `[theatreId,movieId,time]` on the table `NowPlaying` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NowPlaying_theatreId_movieId_time_key" ON "NowPlaying"("theatreId", "movieId", "time");
