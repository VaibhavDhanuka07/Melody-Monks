import type { PrismaClient } from "@prisma/client";
import { cacheService } from "./cache.js";

export type CompetitionSubmissionRecord = {
  id: string;
  instrument: string;
  competitionId?: string | null;
  songTitle: string;
  description?: string | null;
  videoUrl: string;
  createdAt?: Date | string;
  pitchScore?: number | null;
  rhythmScore?: number | null;
  techniqueScore?: number | null;
  expressionScore?: number | null;
};

export const computeJudgeScore = (submission: CompetitionSubmissionRecord) => {
  const values = [
    Number(submission.pitchScore ?? 0),
    Number(submission.rhythmScore ?? 0),
    Number(submission.techniqueScore ?? 0),
    Number(submission.expressionScore ?? 0),
  ].filter((value) => value > 0);
  if (!values.length) return 0;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
};

export const mergeCompetitionScores = (
  submissions: CompetitionSubmissionRecord[],
  voteCountMap: Map<string, number>
) =>
  submissions.map((submission) => {
    const voteCount = voteCountMap.get(submission.id) ?? 0;
    const judgeScore = computeJudgeScore(submission);
    return {
      ...submission,
      voteCount,
      judgeScore,
      totalScore: Math.round((judgeScore + voteCount * 2) * 10) / 10,
    };
  });

export const leaderboardCacheKey = (instrument?: string, competitionId?: string) =>
  `leaderboard:${instrument ?? "all"}:${competitionId ?? "all"}`;

export const submissionsCacheKey = (instrument?: string, competitionId?: string) =>
  `competitions:list:${instrument ?? "all"}:${competitionId ?? "all"}`;

export const getVoteCountMap = async (
  prisma: PrismaClient,
  submissionIds: string[]
) => {
  if (!submissionIds.length) {
    return new Map<string, number>();
  }
  const groups = await prisma.competitionVote.groupBy({
    by: ["submissionId"],
    where: {
      submissionId: { in: submissionIds },
    },
    _count: {
      submissionId: true,
    },
  });

  return new Map(
    groups
      .filter((group) => group.submissionId)
      .map((group) => [group.submissionId as string, group._count.submissionId])
  );
};

export const recomputeLeaderboardCache = async (
  prisma: PrismaClient,
  params: {
    instrument?: string;
    competitionId?: string;
  }
) => {
  const submissions = await prisma.competitionSubmission.findMany({
    where: {
      ...(params.instrument ? { instrument: params.instrument } : {}),
      ...(params.competitionId ? { competitionId: params.competitionId } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  const voteCountMap = await getVoteCountMap(
    prisma,
    submissions.map((submission) => submission.id)
  );
  const enriched = mergeCompetitionScores(submissions, voteCountMap).sort(
    (left, right) => right.totalScore - left.totalScore
  );
  await cacheService.set(leaderboardCacheKey(params.instrument, params.competitionId), enriched, 300);
  await cacheService.set(submissionsCacheKey(params.instrument, params.competitionId), enriched, 120);
  return enriched;
};
