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

type CompetitionVoteGroupRecord = {
  submissionId: string | null;
  _count: { submissionId: number };
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
): Promise<Map<string, number>> => {
  if (!submissionIds.length) {
    return new Map<string, number>();
  }
  const groupBy = prisma.competitionVote.groupBy as unknown as (args: {
    by: ["submissionId"];
    where: { submissionId: { in: string[] } };
    _count: { submissionId: true };
  }) => Promise<CompetitionVoteGroupRecord[]>;

  const groups = await groupBy({
    by: ["submissionId"],
    where: {
      submissionId: { in: submissionIds },
    },
    _count: {
      submissionId: true,
    },
  });

  const entries = groups
    .filter(
      (group): group is CompetitionVoteGroupRecord & { submissionId: string } =>
        Boolean(group.submissionId)
    )
    .map((group) => [group.submissionId, group._count.submissionId] as const);

  return new Map<string, number>(entries);
};

export const recomputeLeaderboardCache = async (
  prisma: PrismaClient,
  params: {
    instrument?: string;
    competitionId?: string;
  }
) => {
  const submissions = (await prisma.competitionSubmission.findMany({
    where: {
      ...(params.instrument ? { instrument: params.instrument } : {}),
      ...(params.competitionId ? { competitionId: params.competitionId } : {}),
    },
    orderBy: { createdAt: "desc" },
  })) as CompetitionSubmissionRecord[];
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
