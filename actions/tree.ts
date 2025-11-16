"use server";

import { prisma } from "@/lib/prisma";
import { buildTree } from "@/lib/tree";





export async function fetchAllRootTreesWithCount() {
  const rows = await prisma.$queryRawUnsafe<any[]>(`
    WITH RECURSIVE tree AS (
      -- Start with root nodes
      SELECT
        c.id AS root_id,
        c.id,
        c.value,
        c."parentId",
        c."authorId",
        u.username
      FROM "CalculationNode" c
      JOIN "User" u ON u.id = c."authorId"
      WHERE c."parentId" IS NULL

      UNION ALL

      -- Recursively join children
      SELECT
        t.root_id,
        c.id,
        c.value,
        c."parentId",
        c."authorId",
        u.username
      FROM "CalculationNode" c
      JOIN tree t ON c."parentId" = t.id
      JOIN "User" u ON u.id = c."authorId"
    )

    SELECT 
      root_id AS "id",
      MIN(value) FILTER (WHERE "parentId" IS NULL) AS "rootValue",
      MIN(username) AS "authorName",
      MIN("authorId") AS "authorId",
      COUNT(*)::int AS "nodeCount"
    FROM tree
    GROUP BY root_id;
  `);

  return rows.map(r => ({
    id: r.id,
    rootValue: Number(r.rootValue),
    authorName: r.authorName,
    authorId: r.authorId,
    nodeCount: Number(r.nodeCount)
  }));
}



export async function fetchFullTree(rootId: string) {
  const result = await prisma.$queryRawUnsafe<any>(`
    WITH RECURSIVE tree AS (
      SELECT 
        c.*,
        u.id       AS "authorId",
        u.username AS "authorUsername"
      FROM "CalculationNode" c
      LEFT JOIN "User" u ON u.id = c."authorId"
      WHERE c.id = '${rootId}'

      UNION ALL

      SELECT 
        c.*,
        u.id       AS "authorId",
        u.username AS "authorUsername"
      FROM "CalculationNode" c
      JOIN tree t ON c."parentId" = t.id
      LEFT JOIN "User" u ON u.id = c."authorId"
    )
    SELECT * FROM tree;
  `);

  return buildTree(result, rootId);
}