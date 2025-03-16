"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateRoadmap, RoadmapInput } from "@/lib/gemini-roadmap";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export async function createRoadmap(input: RoadmapInput) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  try {
    // Generate roadmap content using Gemini
    const generatedRoadmap = await generateRoadmap(input);

    // Use a transaction to ensure all database operations succeed or fail together
    return await prisma.$transaction(async (tx) => {
      // Create the roadmap in the database
      const roadmap = await tx.roadmap.create({
        data: {
          title: generatedRoadmap.title,
          description: generatedRoadmap.description,
          goal: generatedRoadmap.goal,
          currentSkillLevel: input.currentSkillLevel,
          timeCommitment: input.timeCommitment,
          durationInWeeks: generatedRoadmap.durationInWeeks,
          userId: user.id,
        },
      });

      // Prepare all milestone, task and resource data in a single batch
      const milestonesData = generatedRoadmap.milestones.map(
        (milestone, index) => ({
          title: milestone.title,
          description: milestone.description,
          durationInDays: milestone.durationInDays,
          order: index,
          roadmapId: roadmap.id,
          // Using nested writes to create all related entities in a single operation
          tasks: {
            create: milestone.tasks.map((task) => ({
              title: task.title,
              description: task.description,
              dueDate: task.dueDate,
            })),
          },
          resources: {
            create: milestone.resources.map((resource) => ({
              title: resource.title,
              description: resource.description,
              type: resource.type,
              url: resource.url,
            })),
          },
        })
      );

      // Create all milestones with their related tasks and resources in one operation
      await tx.milestone.createMany({
        data: milestonesData.map(
          ({ tasks, resources, ...milestoneData }) => milestoneData
        ),
      });

      // Now create the nested entities for each milestone
      for (const milestoneData of milestonesData) {
        const milestone = await tx.milestone.findFirst({
          where: {
            roadmapId: roadmap.id,
            order: milestoneData.order,
          },
        });

        if (milestone) {
          // Batch create tasks
          if (milestoneData.tasks.create.length > 0) {
            await tx.task.createMany({
              data: milestoneData.tasks.create.map((task, index) => ({
                ...task,
                order: index,
                milestoneId: milestone.id,
              })),
            });
          }

          // Batch create resources
          if (milestoneData.resources.create.length > 0) {
            await tx.resource.createMany({
              data: milestoneData.resources.create.map((resource) => ({
                title: resource.title,
                description: resource.description,
                url: resource.url,
                type: resource.type, // <== Ensure `type` is included
                milestoneId: milestone.id,
              })),
            });
          }
        }
      }

      return {
        success: true,
        roadmapId: roadmap.id,
        error: "",
      };
    });
  } catch (error) {
    console.error("Failed to create roadmap:", error);
    // Return more specific error information for better debugging
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateTaskStatus(taskId: string, isCompleted: boolean) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      // Update the task status and fetch related data in a single query
      const task = await tx.task.update({
        where: { id: taskId },
        data: { isCompleted },
        include: {
          milestone: {
            include: {
              tasks: true,
              roadmap: true,
            },
          },
        },
      });

      const { milestone } = task;
      const milestoneTasks = milestone.tasks;

      // Calculate milestone progress directly from the fetched tasks
      const completedTasks = milestoneTasks.filter((t) => t.isCompleted).length;
      const totalTasks = milestoneTasks.length;
      const milestoneProgress = Math.round((completedTasks / totalTasks) * 100);
      const allTasksCompleted = completedTasks === totalTasks;

      // Get all milestones for the roadmap in a single query
      const roadmapMilestones = await tx.milestone.findMany({
        where: { roadmapId: milestone.roadmapId },
        select: { id: true, progress: true },
      });

      // Update the current milestone's progress
      const updatedMilestones = roadmapMilestones.map((m) =>
        m.id === milestone.id ? { ...m, progress: milestoneProgress } : m
      );

      // Calculate roadmap progress
      const roadmapProgress = Math.round(
        (updatedMilestones.reduce((sum, m) => sum + m.progress, 0) /
          (updatedMilestones.length * 100)) *
          100
      );

      // Update milestone completion status and progress
      await tx.milestone.update({
        where: { id: milestone.id },
        data: {
          isCompleted: allTasksCompleted,
          progress: milestoneProgress,
        },
      });

      // Update roadmap progress
      await tx.roadmap.update({
        where: { id: milestone.roadmapId },
        data: { progress: roadmapProgress },
      });

      revalidatePath(`/roadmaps/${milestone.roadmapId}`);
      return { success: true };
    });
  } catch (error) {
    console.error("Failed to update task status:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update task status",
    };
  }
}

export const deleteRoadmap = async (roadmapId: string) => {
  try {
    await prisma.roadmap.delete({
      where: { id: roadmapId },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting roadmap:", error);
    throw new Error("Failed to delete roadmap");
  }
};
