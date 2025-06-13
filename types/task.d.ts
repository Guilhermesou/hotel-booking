type Task = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    status: TaskStatus;
    description: string;
    staffId: number;
    completedAt: Date | null;
    dueDate: Date;
}

// type TaskStatus = "COMPLETED" | "PENDING" | "IN_PROGRESS"
// schema.prisma
enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}
